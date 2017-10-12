const cheerio = require('cheerio');
const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const codeBlocks = $('stache-code-block');
  const codeTags = $('stache-code');

  if (!codeBlocks.length && !codeTags.length) {
    return content;
  }

  codeBlocks.each((idx, elem) => {
    const $elem = $(elem);
    replaceCharacters($elem);
  });

  codeTags.each((idx, elem) => {
    const $elem = $(elem);
    replaceCharacters($elem);
  });

  return $.html().toString();
};

const replaceCharacters = ($elem) => {
  let content = $elem.html()
    .toString()
    .replace(/{/g, `{{ '{' }}`)
    .replace(/</g, '&lt;');

    $elem.html(content);
}

module.exports = { preload };
