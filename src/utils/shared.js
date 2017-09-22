const path = require('path');
const providersRegExp = new RegExp(/providers\s*:\s*?\[/);

function StachePluginError(message) {
  this.name = 'StachePluginError';
  this.message = message || 'Plugin failure.';
}
StachePluginError.prototype = Error.prototype;

const addToProviders = (content, provider) => {

  if (!hasProvidersArray(content)) {
    content = addProvidersArrayToModule(content);
  }

  return content.toString().replace(
    providersRegExp,
    `providers: [
      /* tslint:disable:trailing-comma */
      ${provider},
      /* tslint:enable:trailing-comma */
  `);
};

const hasProvidersArray = (content) => {
  return providersRegExp.test(content.toString());
}

const addProvidersArrayToModule = (content) => {
  return content.toString().replace(
    '@NgModule({',
    `@NgModule({
        providers: [],
  `);
}

const cheerioConfig = {
  lowerCaseTags: false,
  lowerCaseAttributeNames: false,
  decodeEntities: false
};

const getModulePath = (resourcePath) => {
  let modulePath = '@blackbaud/stache';
  if (/(\/|\\)stache2(\/|\\)/.test(String.raw`${resourcePath}`)) {
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
