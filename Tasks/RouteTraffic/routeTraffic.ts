import * as tl from 'vsts-task-lib/task';
import * as Q from 'q';
import * as querystring from 'querystring';
import * as httpClient from 'typed-rest-client/HttpClient';
import parseString from 'xml2js';

const defaultAuthUrl = 'https://login.windows.net/';
const azureApiVersion = 'api-version=2016-08-01';
let httpObj = new httpClient.HttpClient(tl.getVariable("AZURE_HTTP_USER_AGENT"));

interface IEndpoint {
    envAuthUrl?: string,
    tenantID: string,
    url: string,
    servicePrincipalClientID: string,
    servicePrincipalKey: string,
    subscriptionID: string
}

// unashamedly pilfered from AzureManageWebApp task from vsts-task repo :-)
async function getAuthorizationToken(endPoint: IEndpoint)  {
    var deferred = Q.defer<string>();
    var envAuthUrl = (endPoint.envAuthUrl) ? (endPoint.envAuthUrl) : defaultAuthUrl;
    var authorityUrl = envAuthUrl + endPoint.tenantID + "/oauth2/token/";
    var requestData = querystring.stringify({
        resource: endPoint.url,
        client_id: endPoint.servicePrincipalClientID,
        grant_type: "client_credentials",
        client_secret: endPoint.servicePrincipalKey
    });
    var requestHeader = {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    }

    tl.debug('Requesting for Auth Token: ' + authorityUrl);
    try {
        let res = await httpObj.post(authorityUrl, requestData, requestHeader);
        if (res.message.statusCode === 200)
        {
            var body = await res.readBody();
            deferred.resolve(JSON.parse(body).access_token);
        } else {
            deferred.reject(`Could not get Auth Token: [${res.message.statusCode}] ${res.message.statusMessage}`);
        }
    }
    catch (ex) {
        deferred.reject(ex);
    }

    return deferred.promise;
}

async function applyRoutingRule(endpoint: IEndpoint, 
    webAppName: string, resourceGroupName: string, slotName: string, percentage: number) {
    let deferred = Q.defer<any>();
    let accessToken = await getAuthorizationToken(endpoint);
    tl.debug("Successfully got token");
    let headers = {
        authorization: 'Bearer '+ accessToken,
        'Content-Type': 'application/json'
    };

    let configUrl = `${endpoint.url}subscriptions/${endpoint.subscriptionID}/resourceGroups/${resourceGroupName}/providers/Microsoft.Web/sites/${webAppName}/config/web?${azureApiVersion}`;
    let configData = {
        properties: {
            experiments: {
                rampUpRules: [
                    {
                        name: slotName,
                        actionHostName: `${webAppName}-${slotName}.azurewebsites.net`,
                        reroutePercentage : percentage,
                    }
                ]
            }
        }
    };

    tl.debug(`Configuring rule for experimenting on ${configUrl}`);
    let configDataStr = JSON.stringify(configData);
    tl.debug(`ConfigData = ${configDataStr}`);

    try {
        let res = await httpObj.put(configUrl, configDataStr, headers);
        if (res.message.statusCode === 200)
        {
            try {
                var body = await res.readBody();
                var retConfig = JSON.parse(body);
                var exp = retConfig.properties.experiments.rampUpRules[0];
                tl.debug(`Call success: ${JSON.stringify(exp)}`);
            } catch (e) {
                tl.warning(`Could not deserialize return packet from experiment update: ${e}`);
            }
        
            deferred.resolve(`Successfully configured experiment directing ${percentage}% traffic to ${slotName} on ${webAppName}`);
        } else {
            deferred.reject(`Could not configure app settings experiment: [${res.message.statusCode}] ${res.message.statusMessage}`);
        }
    }
    catch (ex) {
        deferred.reject(ex);
    }

    return deferred.promise;
}

function completeTask(sucess: boolean, message?: any) {
    if (sucess) {
        tl.setResult(tl.TaskResult.Succeeded, message);
    } else {
        let err = message;
        if (message.message) {
            err = message.message;
        }
        tl.setResult(tl.TaskResult.Failed, err);
    }
    tl.debug("Leaving SiteExperiment Task");
}

async function run() {
    tl.debug("Starting SiteExperiment task");

    let connectedServiceName = tl.getInput('ConnectedServiceName', true);

    let endPoint = <IEndpoint>{
        servicePrincipalClientID: tl.getEndpointAuthorizationParameter(connectedServiceName, 'serviceprincipalid', true),
        servicePrincipalKey: tl.getEndpointAuthorizationParameter(connectedServiceName, 'serviceprincipalkey', true),
        tenantID: tl.getEndpointAuthorizationParameter(connectedServiceName, 'tenantid', true),
        subscriptionID: tl.getEndpointDataParameter(connectedServiceName, 'subscriptionid', true),
        envAuthUrl: tl.getEndpointDataParameter(connectedServiceName, 'environmentAuthorityUrl', true),
        url: tl.getEndpointUrl(connectedServiceName, true),
    };

    let slotName = tl.getInput("Slot", true);
    let webAppName = tl.getInput("WebAppName", true);
    let rgName = tl.getInput("ResourceGroupName", true);
    let percentTraffic = parseFloat(tl.getInput("percentTraffic", true));

    await applyRoutingRule(endPoint, webAppName, rgName, slotName, percentTraffic)
        .then(() => completeTask(true, "Successfully applied experiment rule"))
        .catch(err => completeTask(false, err));
}

run();