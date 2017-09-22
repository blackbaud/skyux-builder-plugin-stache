const shared = require('./utils/shared');
const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath);
  const providers = `
  {
    provide: SkyAppSearchResultsProvider,
    useClass: StacheSearchResultsProvider
  }`;

  content = `
import { SkyAppSearchResultsProvider } from '@blackbaud/skyux-builder/runtime';
import { StacheSearchResultsProvider } from ${modulePath};

${content}
`;

  return shared.addToProviders(content, providers);
};

module.exports = { preload };
