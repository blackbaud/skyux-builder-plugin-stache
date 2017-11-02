const shared = require('./utils/shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const useAuth = skyPagesConfig.skyux.auth;

  function injectHttpService() {
    if (useAuth) {
      return `import { SkyAuthHttp } from '@blackbaud/skyux-builder/runtime';`;
    } else {
      return `import { Http } from '@angular/http';`;
    }
  }

  const modulePath = shared.getModulePath(resourcePath);

  content = `
${injectHttpService()}
import { StacheHttpService } from '${modulePath}';

export const STACHE_HTTP_PROVIDERS: any[] = [{
  provide: StacheHttpService,
  useExisting: ${useAuth ? `SkyAuthHttp` : `Http`}
}];
${content}`;

  return shared.addToProviders(content, 'STACHE_HTTP_PROVIDERS');
};

module.exports = { preload };
