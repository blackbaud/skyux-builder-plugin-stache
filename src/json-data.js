const cheerio = require('cheerio');
const stacheJsonDataService = require('./stache-json-data.service');
const shared = require('./shared');

const addElvisOperator = (content) => {
  return content.toString().replace(/stache\.jsonData\./g, 'stache.jsonData?.');
}

const replaceStacheDataAttributes = (tags, $) => {
  tags.each((i, elem) => {
    const $wrapper = $(elem);
    let pageTitle = $wrapper.attr('pageTitle');
    let navTitle = $wrapper.attr('navTitle');

    if (pageTitle) {
      $(elem).attr('pageTitle', (i, id) => {
        return stacheJsonDataService.replaceWithStacheData(id);
      });
    }

    if (navTitle) {
      $(elem).attr('pageTitle', (i, id) => {
        return stacheJsonDataService.replaceWithStacheData(id);
      });
    }
  });
  return addElvisOperator($.html());
}

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    const $ = cheerio.load(content, shared.cheerioConfig);
    const stacheTags = $('stache');

    if (!stacheTags.length) {
      return addElvisOperator(content);
    }

    return replaceStacheDataAttributes(stacheTags, $);
  }

  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  return addStacheDataToAppExtrasModule(content, resourcePath);
};

const addStacheDataToAppExtrasModule = (content, resourcePath) => {
  const dataObject = stacheJsonDataService.getStacheDataObject();
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
    useValue: ${JSON.stringify(dataObject)}
  },
  {
    provide: StacheJsonDataService,
    useClass: StacheJsonDataService
  }
];
/* tslint:enable:quotemark whitespace max-line-length */
${content}`;

  return shared.addToProviders(content, 'STACHE_JSON_DATA_PROVIDERS');
}

module.exports = { preload };
