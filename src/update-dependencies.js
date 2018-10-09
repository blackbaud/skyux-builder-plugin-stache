const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const logger = require('@blackbaud/skyux-logger');
const latestVersion = require('latest-version');
const rootPath = path.join(__dirname, '../../../..');
const rimraf = require('rimraf');

/**
 * Sets the latest versions of skyux, skyux-builder, stache, and whtelist plugin and to the package.json.
 */
const getLatestVersions = () => Promise.all([
  latestVersion('@blackbaud/skyux', { version: '2' }),
  latestVersion('@blackbaud/skyux-builder', { version: '1' }),
  latestVersion('@blackbaud/stache', { version: '2' }),
  latestVersion('@blackbaud/skyux-builder-plugin-auth-email-whitelist', { version: '1' })
]);

const cleanUpTemplate = (skyux, builder, stache, whiteList) => {
  const packagePath = path.join(rootPath, 'package.json');

  const packageJson = fs.readJSONSync(packagePath);

  return new Promise((resolve, reject) => {
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.peerDependencies = packageJson.peerDependencies || {};

    packageJson.dependencies['@blackbaud/skyux'] = skyux;
    packageJson.dependencies['@blackbaud/stache'] = stache;
    packageJson.devDependencies['@blackbaud/skyux-builder'] = builder;

    logger.info(`Setting @blackbaud/skyux version ${skyux}`);
    logger.info(`Setting @blackbaud/skyux-builder version ${builder}`);
    logger.info(`Setting @blackbaud/stache version ${stache}`);

    if (packageJson.dependencies['@blackbaud/skyux-builder-plugin-auth-email-whitelist'] !== undefined) {
      packageJson.dependencies['@blackbaud/skyux-builder-plugin-auth-email-whitelist'] = whiteList;
      logger.info(`Setting @blackbaud/skyux-builder-plugin-auth-email-whitelist version ${whiteList}`);
    }

    try {
      fs.writeJsonSync(packagePath, packageJson, { spaces: 2 });
      resolve();
    } catch(err) {
      logger.info('stache-update failed.');
      reject(err);
    }

  });
}

const removeNodeModules = () => {
  logger.info('Removing node_modules folder');
  return new Promise((resolve, reject) => {
    rimraf(path.join(rootPath, 'node_modules'), {} , (err) => {
      if (err) {
        logger.info('Failed to remove node_modules');
        reject(err);
        return;
      }

      resolve();
    })
  })
}

const npmInstall = () => {
  logger.info('Running npm install');
  const npmProcess = spawn('npm', ['install'], {
    cwd: rootPath,
    stdio: 'inherit'
  });

  return new Promise((resolve, reject) => {
    npmProcess.on('exit', (code) => {
      if (code !== 0) {
        reject('npm install failed.');
        return;
      }

      resolve();
    });
  });
};

const notify = () => {
  logger.info('stache-update has successfully updated your dependences.');
}

module.exports = (args) => {
  return getLatestVersions()
    .then((v) => cleanUpTemplate(v[0], v[1], v[2], v[3]))
    .then(removeNodeModules)
    .then(npmInstall)
    .then(notify)
    .catch(logger.error);
}
