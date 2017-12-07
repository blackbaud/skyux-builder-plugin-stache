const cheerio = require('cheerio');
const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const codeBlocks = $('stache-code-block');
  const codeBlockLanguagesWithGenerics = [
    'csharp',
    'java',
    'typescript'
  ];

  if (!codeBlocks.length) {
    return content;
  }

  codeBlocks.each((idx, elem) => {
    const $elem = $(elem);
    let rawContent = $elem.html().toString();
    if (codeBlockLanguagesWithGenerics.includes($elem.attr('languageType'))) {
      rawContent = rawContent.replace(/<\/(.*?)>/g, '');
    }
    const content = shared.convertToHTMLEntities(rawContent);
    $elem.html(content);
  });

  return $.html().toString();
};

module.exports = { preload };
