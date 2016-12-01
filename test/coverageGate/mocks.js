"use strict";
var MockWebApi;
(function (MockWebApi) {
    var covData;
    var mockCredHandler = {
        prepareRequest: (options) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient, protocol, options, objs, finalCallback) => { }
    };
    function getBasicHandler(username, password) {
        console.log("--- MOCK: return fake basic handler");
        return mockCredHandler;
    }
    MockWebApi.getBasicHandler = getBasicHandler;
    function getBearerHandler(token) {
        console.log("--- MOCK: return fake bearer handler");
        return mockCredHandler;
    }
    MockWebApi.getBearerHandler = getBearerHandler;
    class WebApi {
        constructor(tpcUri, credHandler) {
        }
        getTestApi() {
            return {
                getCodeCoverageSummary: (teamProject, buildId) => covData
            };
        }
    }
    MockWebApi.WebApi = WebApi;
    function setCovDataResult(_covData) {
        console.log("--- MOCK: setting covData");
        covData = _covData;
    }
    MockWebApi.setCovDataResult = setCovDataResult;
})(MockWebApi = exports.MockWebApi || (exports.MockWebApi = {}));
//# sourceMappingURL=mocks.js.map