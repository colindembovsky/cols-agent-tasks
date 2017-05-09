import tl = require('vsts-task-lib/task');

export interface IIncomingMessage {
    statusCode?: number;
    statusMessage?: string;
    body: string;
}

export class HttpClientResponse {
    constructor(public message: IIncomingMessage) {
    }

    readBody() { 
        return Promise.resolve(this.message.body); 
    }
}

export interface IResponse {
    url: string,
    response: Promise<HttpClientResponse>
}

export interface ICall {
    method: string,
    url: string,
    data: any,
    headers: any
}

export module TestHttpClient {
    export var responses = <IResponse[]>{};
    export var calls = <ICall[]>[];

    export function HttpClient(agent) { 
        console.log("--- MOCK: creating mock httpClient");

        return {
            post: (url: string, data: string, headers) => {
                calls.push({
                    method: "push",
                    url: url,
                    data: data,
                    headers: headers
                });
                return Promise.resolve(responses.find(r => r.url === url).response);
            },
            put: (url: string, data: string, headers) => {
                calls.push({
                    method: "put",
                    url: url,
                    data: data,
                    headers: headers
                });
                return Promise.resolve(responses.find(r => r.url === url).response);
            }
        };
    }
}

let endPointParameters = {
    serviceprincipalid: "spId",
    serviceprincipalkey: "spKey",
    tenantid: "tenantId",
}

let endPointData = {
    subscriptionid: "subId",
    environmentAuthorityUrl: "https://manage.me.fake/"
}

export function getEndpointAuthorizationParameter(name: string, key: string, required: boolean) {
    return endPointParameters[key];
}

export function getEndpointDataParameter(name: string, key: string, required: boolean) {
    return endPointData[key];
}

export function getEndpointUrl(name: string, required: boolean) {
    return "https://manage.me.fake/";
}