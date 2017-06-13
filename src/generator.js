const collector = require('./collector');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  let routes = collector.routes;
  if (!Array.isArray(routes)) {
    routes = [];
  }

  let moduleDirectory = '@blackbaud/stache';
  if (resourcePath.match('/stache2/')) {
    moduleDirectory = './public';
  }

  content = `
import {
  StacheRouteMetadataService,
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from '${moduleDirectory}';

export const STACHE_ROUTE_METADATA_PROVIDERS: any[] = [
  { provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG, useValue: ${JSON.stringify(routes)} },
  { provide: StacheRouteMetadataService, useClass: StacheRouteMetadataService }
];
${content}`;

  content = content.replace('providers: [', `providers: [
    STACHE_ROUTE_METADATA_PROVIDERS,`);

  return content;
};

module.exports = { preload };
