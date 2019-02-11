const shared = require('./utils/shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath, skyPagesConfig);
  const provider = `STACHE_CONFIG_PROVIDERS`;

  content = `
import { SkyAppConfig } from '@skyux-sdk/builder/runtime';
import { StacheConfigService } from '${modulePath}';

export const ${provider}: any[] = [{
  provide: StacheConfigService,
  useExisting: SkyAppConfig
}];
${content}`;

  return shared.addToProviders(content, provider);
};

module.exports = { preload };
