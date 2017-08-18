const jsonDataUtil = require('./utils/json-data');
const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return addElvisOperator(content);
  }

  if (resourcePath.match(/app-extras\.module\.ts$/)) {
    return addGlobalDataToAppExtrasModule(content, resourcePath);
  }

  return content;
};

const addElvisOperator = (content) => {
  return content.toString().replace(/\{\{\s*stache.jsonData./g, '{{ stache.jsonData?.');
};

const addGlobalDataToAppExtrasModule = (content, resourcePath) => {
  const globalData = jsonDataUtil.getGlobalData();
  const modulePath = shared.getModulePath(resourcePath);

  content = `
import {
  StacheJsonDataService,
  STACHE_JSON_DATA_SERVICE_CONFIG
} from '${modulePath}';

/* tslint:disable:quotemark whitespace max-line-length */
export const STACHE_JSON_DATA_PROVIDERS: any[] = [
  {
    provide: STACHE_JSON_DATA_SERVICE_CONFIG,
    useValue: ${JSON.stringify(globalData)}
  },
  {
    provide: StacheJsonDataService,
    useClass: StacheJsonDataService
  }
];
/* tslint:enable:quotemark whitespace max-line-length */
${content}`;

  return shared.addToProviders(content, 'STACHE_JSON_DATA_PROVIDERS');
};

module.exports = { preload };
