const shared = require('./utils/shared');
const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
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
