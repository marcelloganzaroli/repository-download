const _ = require('lodash');
const { createGetRequest, getApiBaseUri,
    getDownloadBaseUri, createDownloadRequest, testRequest } = require('./src/service/bitbucketService');

function main(params) {

    if (!params.backupDirectory) {
        console.log(`Specifiy a directory in app paramters`);
        process.exit();
    };

    if (!params.repositoryUser) {
        console.log(`Specifiy an user in app paramters`);
        process.exit();
    };

    getUserRepositories(getApiBaseUri(`/repositories/${params.repositoryUser}`))
        .then((response) => {
            downloadRepositories(response, params.backupDirectory);
        });
}

function getUserRepositories(url, repos) {
    return getRepository(url)
        .then(function (response) {
            repos = storeRepositoryInfo(repos, response.body.values);
            if (!response.body.next) {     ////// ====> CHANGE THIS TO DOWNLOAD ALL PAGES
                return getUserRepositories(response.body.next, repos)
            }
            return repos;
        }, function (error) {
            console.error("Failed!", error);
        });
}

function getRepository(path) {
    return createGetRequest(path);
}

function downloadRepositories(repositories, pathToWrite) {
    const promiseOfAllDownloadTask = _.map(repositories, (r) => {
        return testRequest(getDownloadBaseUri(`${r.path}/get/HEAD.zip`));
    });
    Promise.all(promiseOfAllDownloadTask)
        .then((responses) => {            
            writeFile(responses, pathToWrite);
        }, (error) => {
            console.log(error);
        })
}

function storeRepositoryInfo(repos, requestRepositories) {
    if (!repos) { repos = []; };
    _.forEach(requestRepositories, function (repository) {
        repos = _.concat(repos, [{ name: repository.name, path: repository.full_name }]);
    });
    return repos;
}

function writeFile(stringFiles, pathToWrite) {
    const shelljs = require('shelljs');
    if (shelljs.test('-d', pathToWrite)) {

    };

    shelljs.mkdir(pathToWrite);
    _.forEach(stringFiles, function (zip) {

    });

}
main({
    "repositoryUser": process.argv[2],
    "backupDirectory": process.argv[3]
});
