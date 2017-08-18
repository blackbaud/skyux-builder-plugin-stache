const cheerio = require('cheerio');
const jsonDataUtil = require('./utils/json-data');
const shared = require('./utils/shared');
const elements = [
  {
    tag: 'stache',
    attributes: ['pageTitle', 'navTitle']
  },
  {
    tag: 'stache-include',
    attributes: ['fileName']
  }
];

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return editHTMLContent(content);
  }

  return content;
};

const editHTMLContent = (content) => {
  const $ = cheerio.load(content, shared.cheerioConfig);

  elements.forEach(element => {
    parseAttributes($, element);
  });

  return $.html();
};

const parseAttributes = ($, element) => {
  const tags = $(element.tag);

  element.attributes.forEach(attribute => {
    tags.each((idx, elem) => {
      const $elem = $(elem);

      if (hasAttribute($elem, attribute)) {
        $elem.attr(attribute, (idx, attributeValue) => {
          return jsonDataUtil.parseAngularBindings(attributeValue)
        });
      }
    });
  });
};

const hasAttribute = ($element, attribute) => {
  return $element.attr(attribute) !== undefined;
};

module.exports = { preload };
