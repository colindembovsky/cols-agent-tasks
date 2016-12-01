export module MockWebApi {
    var covData;
    var mockCredHandler = { // a mock IRequestHandler
        prepareRequest: (options: any) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient: any, protocol: any, options: any, objs: any, finalCallback: any) => { }
    };

    export function getBasicHandler(username, password) { 
        console.log("--- MOCK: return fake basic handler");
        return mockCredHandler;
    }
    
    export function getBearerHandler(token) { 
        console.log("--- MOCK: return fake bearer handler");
        return mockCredHandler; 
    }

    export class WebApi {
        constructor(tpcUri, credHandler) {
        }

        getTestApi() {
            return {
                getCodeCoverageSummary: (teamProject, buildId) => covData
            }
        }
    }

    export function setCovDataResult(_covData) { 
        console.log("--- MOCK: setting covData")
        covData = _covData;
    }
}