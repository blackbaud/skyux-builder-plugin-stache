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

const getModulePath = (resourcePath, skyPagesConfig) => {
  let modulePath = '@blackbaud/skyux-lib-stache'
  if (skyPagesConfig.skyux.name === 'skyux-lib-stache') {
    modulePath = './public/public_api';
  }

  return modulePath;
};

const resolveAssetsPath = (...pathSegments) => {
  const args = [process.cwd(), 'src', 'stache'].concat(pathSegments);
  return path.resolve.apply(path, args);
};

const convertToHTMLEntities = (content) => {
  return content.replace(/{/g, `{{ '{' }}`)
    .replace(/</g, '&lt;');
}

module.exports = {
  StachePluginError,
  convertToHTMLEntities,
  addToProviders,
  cheerioConfig,
  getModulePath,
  resolveAssetsPath
};
