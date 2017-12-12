const fs = require('fs-extra');
const path = require('path');
const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  function generateRepoUrlObject(url) {
    const githubFilePathRoot = '/tree/master/src/app/';
    const vstsFilePathRoot = '?path=%2Fsrc%2Fapp%2F';
    const vstsRepoBranchSelector = '&version=GBmaster';

    let result = {};

    if (url.includes('visualstudio')) {
      result.url = url + vstsFilePathRoot;
      result.vstsBranchSelector = vstsRepoBranchSelector;
    } else {
      result.url = url + githubFilePathRoot;
    }

    return result;
  }

  const packageJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));

  let url = packageJson.repository.url;

  if (url.endsWith('.git')) {
    url = url.split('.git')[0];
  }

  const repoLink = generateRepoUrlObject(url);

  const filePath = shared.resolveAssetsPath('data');

  fs.writeFileSync(path.join(filePath, 'repo.json'), JSON.stringify(repoLink));

  return content;
};

module.exports = { preload };
