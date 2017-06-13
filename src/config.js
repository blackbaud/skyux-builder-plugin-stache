const shared = require('./shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath);

  content = `
import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';
import { StacheConfigService } from '${modulePath}';

export const STACHE_CONFIG_PROVIDERS: any[] = [{
  provide: StacheConfigService,
  useExisting: SkyAppConfig
}];
${content}`;

  return shared.addToProviders(content, 'STACHE_CONFIG_PROVIDERS');
};

module.exports = { preload };
