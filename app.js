const _ = require('lodash');
const shell = require('shelljs');
const { createGetRequest, getApiBaseUri } = require('./src/service/bitbucketService');

function main(params) {
    
    if (!shell.which('git')) {
        shell.echo('This script requires git');
        shell.exit(1);
    }

    if (!params.backupDirectory) {
        console.log(`Specifiy a directory in app paramters`);
        process.exit();
    };

    if (!params.repositoryUser) {
        console.log(`Specifiy an user in app paramters`);
        process.exit();
    };

    if (!shell.test('-e', params.backupDirectory)) {
        console.log(`Directory ${params.backupDirectory} do not exists`);
        process.exit();
    }

    getUserRepositories(getApiBaseUri(`/repositories/${params.repositoryUser}`))
        .then((response) => {
            cloneRepositories(response, params.backupDirectory);
        });
}

function getUserRepositories(url, repos) {
    return getRepository(url)
        .then(function (response) {
            repos = storeRepositoryInfo(repos, response.body.values);
            if (!response.body.next) {   ////CHANGE THIS LATER TO DOWLOAD ALL PAGES
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

function cloneRepositories(repositories, pathToWrite) {
    let fullPath;
    if (shell.test('-d', pathToWrite)) {
        fullPath = _.head(shell.pushd(pathToWrite));
        shell.rm('-rf', `${fullPath}\\*`);
    } else {
        shell.mkdir(pathToWrite);
        fullPath = _.head(shell.pushd(pathToWrite));
    };

    _.forEach(repositories, (r) => {
        console.log(`git clone --mirror ${r.name}`);
        return gitCloneSource(r.git, fullPath + `\\` + r.name);
    });
}

function gitCloneSource(remoteRepositoryLink, localPath) {
    if (shell.exec(`git clone --mirror ${remoteRepositoryLink} ${localPath}`).code !== 0) {
        shell.echo(`Error: Git clone for${remoteRepositoryLink} failed`);
    }
};

function storeRepositoryInfo(repos, requestRepositories) {
    if (!repos) { repos = []; };
    _.forEach(requestRepositories, function (repository) {
        repos = _.concat(repos, [ { name: repository.slug, git: (_.find(repository.links.clone, function (o) { return o.name = 'https'; })).href } ]);
    });
    return repos;
}

main({
    "repositoryUser": process.argv[ 2 ],
    "backupDirectory": process.argv[ 3 ]
});
