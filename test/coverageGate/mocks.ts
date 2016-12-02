export module MockWebApi {
    export var covData;
    export var calledBasic = false;
    export var calledBearer = false;

    var mockCredHandler = { // a mock IRequestHandler
        prepareRequest: (options: any) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient: any, protocol: any, options: any, objs: any, finalCallback: any) => { }
    };

    export function getBasicHandler(username, password) { 
        console.log("--- MOCK: return fake basic handler");
        calledBasic = true;
        return mockCredHandler;
    }
    
    export function getBearerHandler(token) { 
        console.log("--- MOCK: return fake bearer handler");
        calledBearer = true;
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
}