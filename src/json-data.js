const cheerio = require('cheerio');
const jsonDataUtil = require('./utils/json-data');
const shared = require('./utils/shared');
const replaceJsonRegExp = new RegExp(/\{\{\s*@buildtime:\s*stache.jsonData.*\}\}/g);

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
    content = parseStacheAttributeBindings(stacheTags, $);
  }

  content = parseReplaceAngularBindings($.html().toString());
  return addElvisOperator(content);
};

const parseStacheAttributeBindings = (tags, $) => {
  tags.each((idx, elem) => {
    const $wrapper = $(elem);
    let pageTitle = $wrapper.attr('pageTitle');
    let navTitle = $wrapper.attr('navTitle');

    if (pageTitle) {
      $(elem).attr('pageTitle', (idx, attrValue) => {
        return jsonDataUtil.parseAngularBinding(attrValue);
      });
    }

    if (navTitle) {
      $(elem).attr('navTitle', (idx, attrValue) => {
        return jsonDataUtil.parseAngularBinding(attrValue);
      });
    }
  });

  return $.html();
};

const parseReplaceAngularBindings = (content) => {
  const matches = content.match(replaceJsonRegExp);
  if (!matches) {
    return content;
  }
  let replaceValues = matches.map(i => {
    let val = i.replace('@buildtime:', '');
    return {
      key: i,
      value: jsonDataUtil.parseAngularBinding(val)
    }
  });
  replaceValues.forEach(val => {
    content = content.replace(val.key, val.value);
  });

  return content;
};

const addElvisOperator = (content) => {
  return content.toString().replace(/\{\{\s*stache.jsonData./g, '{{ stache.jsonData?.');
};

const addStacheDataToAppExtrasModule = (content, resourcePath) => {
  const globalData = jsonDataUtil.getGlobalData();
  const modulePath = shared.getModulePath(resourcePath);

  content = `
import {
  jsonDataUtil,
  STACHE_JSON_DATA_SERVICE_CONFIG
} from '${modulePath}';

/* tslint:disable:quotemark whitespace max-line-length */
export const STACHE_JSON_DATA_PROVIDERS: any[] = [
  {
    provide: STACHE_JSON_DATA_SERVICE_CONFIG,
    useValue: ${JSON.stringify(globalData)}
  },
  {
    provide: jsonDataUtil,
    useClass: jsonDataUtil
  }
];
/* tslint:enable:quotemark whitespace max-line-length */
${content}`;

  return shared.addToProviders(content, 'STACHE_JSON_DATA_PROVIDERS');
};

module.exports = { preload };
