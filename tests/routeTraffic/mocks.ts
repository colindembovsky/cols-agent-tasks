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
    url: string
}

export module TestHttpClient {
    export var responses = <IResponse[]>{};

    export function HttpClient(agent) { 
        console.log("--- MOCK: creating mock httpClient");
        return {
            post: (url: string, data: string, headers) => {
                return responses.find(r => r.url === url);
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
    environmentAuthorityUrl: null
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