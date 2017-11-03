const shared = require('./utils/shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath);
  let httpName;
  let httpPath;

  if (skyPagesConfig.skyux.auth) {
    httpName = 'SkyAuthHttp';
    httpPath = '@blackbaud/skyux-builder/runtime';
  } else {
    httpName = 'Http';
    httpPath = '@angular/http';
  }

  content = `
import { ${httpName} } from '${httpPath}';
import { StacheHttpService } from '${modulePath}';

export const STACHE_HTTP_PROVIDERS: any[] = [{
  provide: StacheHttpService,
  useExisting: ${httpName}
}];
${content}`;

  return shared.addToProviders(content, 'STACHE_HTTP_PROVIDERS');
};

module.exports = { preload };
