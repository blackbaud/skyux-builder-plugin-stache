const cheerio = require('cheerio');
const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const stacheTags = $('stache');

  if (!stacheTags.length) {
    return content;
  }

  stacheTags.each((idx, elem) => {
    $(elem).attr('#stache', '');
  });

  return $.html().toString();
};

module.exports = { preload };
