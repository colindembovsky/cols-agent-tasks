"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return Promise.resolve(this.message.body);
    }
}
exports.HttpClientResponse = HttpClientResponse;
var TestHttpClient;
(function (TestHttpClient) {
    TestHttpClient.responses = {};
    TestHttpClient.calls = [];
    function HttpClient(agent) {
        console.log("--- MOCK: creating mock httpClient");
        return {
            post: (url, data, headers) => {
                TestHttpClient.calls.push({
                    method: "push",
                    url: url,
                    data: data,
                    headers: headers
                });
                return Promise.resolve(TestHttpClient.responses.find(r => r.url === url).response);
            },
            put: (url, data, headers) => {
                TestHttpClient.calls.push({
                    method: "put",
                    url: url,
                    data: data,
                    headers: headers
                });
                return Promise.resolve(TestHttpClient.responses.find(r => r.url === url).response);
            }
        };
    }
    TestHttpClient.HttpClient = HttpClient;
})(TestHttpClient = exports.TestHttpClient || (exports.TestHttpClient = {}));
let endPointParameters = {
    serviceprincipalid: "spId",
    serviceprincipalkey: "spKey",
    tenantid: "tenantId",
};
let endPointData = {
    subscriptionid: "subId",
    environmentAuthorityUrl: "https://manage.me.fake/"
};
function getEndpointAuthorizationParameter(name, key, required) {
    return endPointParameters[key];
}
exports.getEndpointAuthorizationParameter = getEndpointAuthorizationParameter;
function getEndpointDataParameter(name, key, required) {
    return endPointData[key];
}
exports.getEndpointDataParameter = getEndpointDataParameter;
function getEndpointUrl(name, required) {
    return "https://manage.me.fake/";
}
exports.getEndpointUrl = getEndpointUrl;
//# sourceMappingURL=mocks.js.map