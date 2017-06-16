const path = require('path');

function StachePluginError(message) {
  this.name = 'StachePluginError';
  this.message = message || 'Plugin failure.';
}
StachePluginError.prototype = Error.prototype;

const addToProviders = (content, provider) => {
  return content.replace(
    'providers: [',
    `providers: [
      /* tslint:disable:trailing-comma */
      ${provider},
      /* tslint:enable:trailing-comma */
`);
};

const cheerioConfig = {
  lowerCaseTags: false,
  lowerCaseAttributeNames: false,
  decodeEntities: false
};

const getModulePath = (resourcePath) => {
  let modulePath = '@blackbaud/stache';
  if (resourcePath.match('/stache2/')) {
    modulePath = './public';
  }

  return modulePath;
};

const resolveAssetsPath = (...pathSegments) => {
  const args = [process.cwd(), 'src', 'stache'].concat(pathSegments);
  return path.resolve.apply(path, args);
};

module.exports = {
  StachePluginError,
  addToProviders,
  cheerioConfig,
  getModulePath,
  resolveAssetsPath
};
