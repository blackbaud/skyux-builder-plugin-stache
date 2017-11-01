const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath);

  content = `
import { SkyAuthHttp } from '@blackbaud/skyux-builder/runtime';
import { StacheAuthHttpService } from '${modulePath}';

export const STACHE_AUTH_HTTP_PROVIDERS: any[] = [{
  provide: StacheAuthHttpService,
  useExisting: SkyAuthHttp
}];
${content}`;

  return shared.addToProviders(content, 'STACHE_AUTH_HTTP_PROVIDERS');
};

module.exports = { preload };
