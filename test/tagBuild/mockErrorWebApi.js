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
            return {
                getResourceArea(areaId) {
                    return Promise.resolve({
                        locationUrl: "theUrl"
                    });
                }
            };
        }
        getBuildApi() {
            return {
                addBuildTags(tags, teamProject, buildId) {
                    console.log("--- MOCK: calling buildAPI.addBuildTags");
                    MockWebApi.taggerCall.callType = 'Build';
                    MockWebApi.taggerCall.tags = tags;
                    MockWebApi.taggerCall.project = teamProject;
                    MockWebApi.taggerCall.id = buildId;
                    return Promise.reject("Something went wrong with build api call");
                }
            };
        }
        getReleaseApi(resourceUrl) {
            return {
                addReleaseTags(tags, teamProject, releaseId) {
                    console.log("--- MOCK: calling releaseAPI.addReleaseTags");
                    MockWebApi.taggerCall.callType = 'Release';
                    MockWebApi.taggerCall.tags = tags;
                    MockWebApi.taggerCall.project = teamProject;
                    MockWebApi.taggerCall.id = releaseId;
                    return Promise.reject("Something went wrong with release api call");
                }
            };
        }
    }
    MockWebApi.WebApi = WebApi;
})(MockWebApi = exports.MockWebApi || (exports.MockWebApi = {}));
//# sourceMappingURL=mockErrorWebApi.js.map