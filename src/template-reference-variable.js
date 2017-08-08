const cheerio = require('cheerio');
const shared = require('./shared');

const pluginOrder = 6;

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const stacheTags = $('stache');

  if (!stacheTags.length) {
    return content;
  }

  stacheTags.each((i, elem) => {
    $(elem).attr('#stache', '');
  });

  return $.html().toString();
};

module.exports = { preload, pluginOrder };
