const cheerio = require('cheerio');
const fs = require('fs-extra');
const glob = require('glob');
const shared = require('./shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  if (!skyPagesConfig.runtime.routes || skyPagesConfig.runtime.routes.length === 0) {
    return content;
  }

  const routes = [];
  const htmlPaths = glob.sync('./src/app/**/*.html');

  if (!htmlPaths.length) {
    return content;
  }

  htmlPaths.forEach(htmlPath => {
    let contents;

    try {
      contents = fs.readFileSync(htmlPath);
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

    const $ = cheerio.load(contents, shared.cheerioConfig);
    const stacheTags = $('stache');

    if (!stacheTags.length) {
      return;
    }

    stacheTags.each((i, elem) => {
      const $wrapper = $(elem);
      const preferredName = $wrapper.attr('navTitle') || $wrapper.attr('pageTitle');

      if (!preferredName) {
        return;
      }

      skyPagesConfig.runtime.routes.forEach(route => {
        const match = ['src/app', route.routePath, 'index.html'].join('/');
        if (htmlPath.endsWith(match)) {
          routes.push({
            path: route.routePath,
            name: preferredName
          });
        }
      });
    });
  });

  if (!routes.length) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath);

  content = `
import {
  StacheRouteMetadataService,
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from '${modulePath}';

export const STACHE_ROUTE_METADATA_PROVIDERS: any[] = [
  { provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG, useValue: ${JSON.stringify(routes)} },
  { provide: StacheRouteMetadataService, useClass: StacheRouteMetadataService }
];
${content}`;

  return shared.addToProviders(content, 'STACHE_ROUTE_METADATA_PROVIDERS');
};

module.exports = {
  preload
};
