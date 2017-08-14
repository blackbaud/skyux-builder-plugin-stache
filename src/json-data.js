const cheerio = require('cheerio');
const stacheJsonDataService = require('./services/stache-json-data.service');
const shared = require('./services/shared');

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return editHTMLContent(content);
  }

  if (resourcePath.match(/app-extras\.module\.ts$/)) {
    return addStacheDataToAppExtrasModule(content, resourcePath);
  }

  return content;
};

const editHTMLContent = (content) => {
  const $ = cheerio.load(content, shared.cheerioConfig);
  const stacheTags = $('stache');

  if (stacheTags.length > 0) {
    content = replaceStacheDataAttributes(stacheTags, $);
  }

  return addElvisOperator(content);
};

const replaceStacheDataAttributes = (tags, $) => {
  tags.each((idx, elem) => {
    const $wrapper = $(elem);
    let pageTitle = $wrapper.attr('pageTitle');
    let navTitle = $wrapper.attr('navTitle');

    if (pageTitle) {
      $(elem).attr('pageTitle', (idx, attrValue) => {
        return stacheJsonDataService.replaceWithStacheData(attrValue);
      });
    }

    if (navTitle) {
      $(elem).attr('navTitle', (idx, attrValue) => {
        return stacheJsonDataService.replaceWithStacheData(attrValue);
      });
    }
  });

  return $.html();
};

const addElvisOperator = (content) => {
  return content.toString().replace(/\{\{\s*stache.jsonData./g, '{{ stache.jsonData?.');
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
};

module.exports = { preload };
