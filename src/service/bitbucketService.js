const superagent = require('superagent');
const logger = require('superagent-logger');

function createGetRequest(service, isDownloadCall, agent) {
    if (!agent) {
        agent = superagent;
    }
    return setHeaders(agent.get(service), getAuthorizationToken(isDownloadCall));
}

function getAuthorizationToken(isDownloadCall) {
    if (!isDownloadCall) {
        return process.env.API_BITBUCKET_SECRET;
    } else {
        return process.env.SITE_BITBUCKET_SECRET;
    }

}

function setHeaders(request, accessToken) {
    if (accessToken) {
        request.set('Authorization', accessToken);
    }
    return request.set('Accept', 'application/json')
        .use(logger({
            timestamp: true
        }));
}

function getApiBaseUri(path) {
    return `https://api.bitbucket.org/2.0${path}`;
}

function getDownloadBaseUri(path) {
    return `https://bitbucket.org/${path}`;
}


exports.createGetRequest = createGetRequest;
exports.getApiBaseUri = getApiBaseUri;
exports.getDownloadBaseUri = getDownloadBaseUri;

