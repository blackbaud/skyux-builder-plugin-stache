const cheerio = require('cheerio');
const shared = require('./utils/shared');
const jsonDataUtil = require('./utils/json-data');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const codeBlocks = $('stache-code-block');

  if (!codeBlocks.length) {
    return content;
  }

  codeBlocks.each((idx, elem) => {
    const $elem = $(elem);
      let content = jsonDataUtil.parseAllBuildTimeBindings($elem.html())
      .replace(/{/g, `{{ '{' }}`)
      .replace(/</g, '&lt;');

    $elem.html(content);
  });

  return $.html().toString();
};

module.exports = { preload };
