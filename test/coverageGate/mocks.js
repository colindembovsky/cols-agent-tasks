"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockWebApi;
(function (MockWebApi) {
    MockWebApi.calledBasic = false;
    MockWebApi.calledBearer = false;
    var mockCredHandler = {
        prepareRequest: (options) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient, protocol, options, objs, finalCallback) => { }
    };
    function getBasicHandler(username, password) {
        console.log("--- MOCK: return fake basic handler");
        MockWebApi.calledBasic = true;
        return mockCredHandler;
    }
    MockWebApi.getBasicHandler = getBasicHandler;
    function getBearerHandler(token) {
        console.log("--- MOCK: return fake bearer handler");
        MockWebApi.calledBearer = true;
        return mockCredHandler;
    }
    MockWebApi.getBearerHandler = getBearerHandler;
    class WebApi {
        constructor(tpcUri, credHandler) {
        }
        getTestApi() {
            return {
                getCodeCoverageSummary: (teamProject, buildId) => MockWebApi.covData
            };
        }
    }
    MockWebApi.WebApi = WebApi;
})(MockWebApi = exports.MockWebApi || (exports.MockWebApi = {}));
//# sourceMappingURL=mocks.js.map