const cheerio = require('cheerio');
const fs = require('fs-extra');
const glob = require('glob');
const shared = require('./utils/shared');
const jsonDataUtil = require('./utils/json-data');

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

    const foundRoutes = skyPagesConfig.runtime.routes.filter(route => {
      const match = ['src/app', route.routePath, 'index.html'].join('/');
      return (htmlPath.endsWith(match));
    });

    stacheTags.each((idx, elem) => {
      const $wrapper = $(elem);
      const preferredName = $wrapper.attr('navTitle') || $wrapper.attr('pageTitle');
      const preferredOrder = $wrapper.attr('navOrder');
      const hideFromSidebar = $wrapper.attr('hideFromNavbar');

      if (!preferredName && !preferredOrder) {
        return;
      }

      foundRoutes.forEach(route => {
        let routeMetadata = {
          path: route.routePath
        };

        if (preferredName !== undefined) {
          routeMetadata.name = jsonDataUtil.parseAngularBindings(preferredName);
        }

        if (hideFromSidebar === 'true') {
          routeMetadata.hideFromSidebar = hideFromSidebar;
        }

        if (preferredOrder !== undefined) {
          routeMetadata.order = preferredOrder;
        }

        routes.push(routeMetadata);
      });
    });
  });

  if (!routes.length) {
    return content;
  }

  const modulePath = shared.getModulePath(resourcePath, skyPagesConfig);

  content = `
import {
  StacheRouteMetadataService,
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from '${modulePath}';

/* tslint:disable:quotemark whitespace max-line-length */
export const STACHE_ROUTE_METADATA_PROVIDERS: any[] = [
  {
    provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG,
    useValue: ${JSON.stringify(routes)}
  },
  {
    provide: StacheRouteMetadataService,
    useClass: StacheRouteMetadataService
  }
];
/* tslint:enable:quotemark whitespace max-line-length */
${content}`;

  return shared.addToProviders(content, 'STACHE_ROUTE_METADATA_PROVIDERS');
};

module.exports = { preload };
