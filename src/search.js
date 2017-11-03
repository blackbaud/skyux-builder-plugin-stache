const shared = require('./utils/shared');
const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  function checkConfig(config) {
    if (
      config &&
      config.skyux &&
      config.skyux.appSettings &&
      config.skyux.appSettings.stache &&
      config.skyux.appSettings.stache.searchConfig &&
      config.skyux.appSettings.stache.searchConfig.enableSearchBeta
    ) {
      return config.skyux.appSettings.stache.searchConfig.enableSearchBeta;
    }
    return false;
  }

  const enableSearchBeta = checkConfig(skyPagesConfig);

  if (!enableSearchBeta) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath);

  content = `
import { SkyAppSearchResultsProvider } from '@blackbaud/skyux-builder/runtime';
import { StacheSearchResultsProvider } from '${modulePath}';

export const STACHE_SEARCH_RESULTS_PROVIDERS: any[] = [{
  provide: SkyAppSearchResultsProvider,
  useClass: StacheSearchResultsProvider
}];

${content}
`;

  return shared.addToProviders(content, 'STACHE_SEARCH_RESULTS_PROVIDERS');
};

module.exports = { preload };
