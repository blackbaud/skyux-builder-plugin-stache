const cheerio = require('cheerio');
const shared = require('./services/shared');

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
    const innerText = $elem.html()
      .toString()
      .replace(/{/g, `{{ '{' }}`)
      .replace(/</g, '&lt;');

    $elem.text(innerText);
  });

  return $.html().toString();
};

module.exports = { preload };
