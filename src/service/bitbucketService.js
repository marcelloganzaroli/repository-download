const superagent = require('superagent');
const logger = require('superagent-logger');
const request = require('request');

function createGetRequest(service, agent) {
    if (!agent) {
        agent = superagent;
    }
    return setHeaders(agent.get(service), getAuthorizationToken());
}

function createDownloadRequest(path) {
    isDownloadCall = true;
    console.log('Downloading', path);
    return request.get(
        {
            url: path,
            forever: true,
            headers: {
                "Authorization": getAuthorizationToken(isDownloadCall)
            }
        });
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

function testRequest(url) {
    return new Promise(function () {
        request( url, function (error, response, body) {
            return body;
        });
    });
}


exports.createGetRequest = createGetRequest;
exports.getApiBaseUri = getApiBaseUri;
exports.getDownloadBaseUri = getDownloadBaseUri;
exports.createDownloadRequest = createDownloadRequest;
exports.testRequest = testRequest;

// const promise = testRequest('https://bitbucket.org/fssibusinessdev/gift-register/get/HEAD.zip');


