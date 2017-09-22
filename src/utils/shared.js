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
  // For backslashes, we need to convert the string to raw:
  // https://stackoverflow.com/questions/10041998/get-backslashes-inside-a-string-javascript
  if (String.raw`${resourcePath}`.match(/(\/|\\)stache2(\/|\\)/)) {
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
