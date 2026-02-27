"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockWebApi = void 0;
var MockWebApi;
(function (MockWebApi) {
    MockWebApi.calledBearer = false;
    MockWebApi.taggerCall = {
        callType: '',
        tags: [],
        id: 0,
        project: ''
    };
    var mockCredHandler = {
        prepareRequest: (options) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient, protocol, options, objs, finalCallback) => { }
    };
    function getBearerHandler(token) {
        console.log("--- MOCK: return fake bearer handler");
        MockWebApi.calledBearer = true;
        return mockCredHandler;
    }
    MockWebApi.getBearerHandler = getBearerHandler;
    class WebApi {
        constructor(tpcUri, credHandler) {
        }
        getLocationsApi() {
            return Promise.resolve({
                getResourceArea(areaId) {
                    return Promise.resolve({
                        locationUrl: "theUrl"
                    });
                }
            });
        }
        getBuildApi() {
            return Promise.resolve({
                addBuildTags(tags, teamProject, buildId) {
                    console.log("--- MOCK: calling buildAPI.addBuildTags");
                    MockWebApi.taggerCall.callType = 'Build';
                    MockWebApi.taggerCall.tags = tags;
                    MockWebApi.taggerCall.project = teamProject;
                    MockWebApi.taggerCall.id = buildId;
                    return Promise.resolve(tags);
                }
            });
        }
        getReleaseApi(resourceUrl) {
            return Promise.resolve({
                addReleaseTags(tags, teamProject, releaseId) {
                    console.log("--- MOCK: calling releaseAPI.addReleaseTags");
                    MockWebApi.taggerCall.callType = 'Release';
                    MockWebApi.taggerCall.tags = tags;
                    MockWebApi.taggerCall.project = teamProject;
                    MockWebApi.taggerCall.id = releaseId;
                    return Promise.resolve(tags);
                }
            });
        }
    }
    MockWebApi.WebApi = WebApi;
})(MockWebApi || (exports.MockWebApi = MockWebApi = {}));
//# sourceMappingURL=mockWebApi.js.map