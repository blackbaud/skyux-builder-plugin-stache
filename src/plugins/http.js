const shared = require('./utils/shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath, skyPagesConfig);
  const provider = `STACHE_HTTP_PROVIDERS`;
  let httpName;
  let httpPath;

  if (skyPagesConfig.skyux.auth) {
    httpName = 'SkyAuthHttp';
    httpPath = '@skyux/http';
  } else {
    httpName = 'Http';
    httpPath = '@angular/http';
  }

  content = `
import { ${httpName} } from '${httpPath}';
import { StacheHttpService } from '${modulePath}';

export const ${provider}: any[] = [{
  provide: StacheHttpService,
  useExisting: ${httpName}
}];
${content}`;

  return shared.addToProviders(content, provider);
};

module.exports = { preload };
