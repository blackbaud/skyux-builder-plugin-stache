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
      const preferredOrder = $wrapper.attr('navOrder');

      skyPagesConfig.runtime.routes.forEach(route => {
        const match = ['src/app', route.routePath, 'index.html'].join('/');
        if (htmlPath.endsWith(match)) {

          let route = {
            path: route.routePath,
            name: route.name
          }

          if (preferredName) {
            route.name = preferredName;
          }

          if ( preferredOrder !== undefined) {
            route.order = preferredOrder;
          }

          routes.push(route);
        }
      });
    });
  });

  if (!routes.length) {
    return content;
  }

  let orderedRoutes = routes.filter(route => route.hasOwnProperty('order'))
    .sort(sortByName)
    .sort(sortByOrder);
  let unOrderedRoutes = routes.filter(route => !route.hasOwnProperty('order'))
    .sort(sortByName);
  let sortedRoutes = orderedRoutes.concat(unOrderedRoutes);

  const modulePath = shared.getModulePath(resourcePath);

  content = `
import {
  StacheRouteMetadataService,
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from '${modulePath}';

/* tslint:disable:quotemark whitespace max-line-length */
export const STACHE_ROUTE_METADATA_PROVIDERS: any[] = [
  {
    provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG,
    useValue: ${JSON.stringify(sortedRoutes)}
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

function sortByName(a , b) {
  if(a.name < b.name) {
    return -1;
  }
  if(a.name > b.name) {
    return 1;
  }
  return 0;
}

function sortByOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  }
  if(a.order > b.order) {
    return 1;
  }
  return 0;
}

module.exports = {
  preload
};
