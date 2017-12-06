const cheerio = require('cheerio');
const shared = require('./utils/shared');

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
    let rawContent = $elem.html().toString();
    if (shared.codeBlockLanguagesWithGenerics.includes($elem.attr('languageType'))) {
      rawContent = rawContent.replace(/<\/(.*?)>/, '');
    }
    const content = shared.convertToHTMLEntities(rawContent);
    $elem.html(content);
  });

  return $.html().toString();
};

module.exports = { preload };
