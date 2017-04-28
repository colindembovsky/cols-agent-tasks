export module MockWebApi {
    export var calledBearer = false;
    export var taggerCall = {
        tags: <string[]>[],
        buildId: 0,
        project: ''
    }

    var mockCredHandler = { // a mock IRequestHandler
        prepareRequest: (options: any) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient: any, protocol: any, options: any, objs: any, finalCallback: any) => { }
    };

    export function getBearerHandler(token) { 
        console.log("--- MOCK: return fake bearer handler");
        calledBearer = true;
        return mockCredHandler; 
    }

    export class WebApi {
        constructor(tpcUri, credHandler) {
        }

        getBuildApi() {
            return {
                addBuildTags(tags: string[], teamProject: string, buildId: number) {
                    taggerCall.tags = tags;
                    taggerCall.project = teamProject;
                    taggerCall.buildId = buildId;
                }
            };
        }
    }
}