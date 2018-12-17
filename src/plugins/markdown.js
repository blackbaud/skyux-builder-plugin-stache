const cheerio = require('cheerio');
const marked = require('marked');
const shared = require('./utils/shared');

const getRenderer = () => {
  const renderer = new marked.Renderer();

  renderer.code = (code, language) =>
`<sky-code-block languageType="${language}">
${code}
</sky-code-block>
`;

  renderer.heading = (text, level) => {
    let parsedHeading = `
<h${level}>
  ${text}
</h${level}>
`;

    if (level === 2) {
      parsedHeading = `
<stache-page-anchor>
  ${text}
</stache-page-anchor>
`;
    }

    return parsedHeading;
  };

  renderer.codespan = (text) => `<stache-code>${text}</stache-code>`;

  return renderer;
}

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const markdownBlocks = $('stache-markdown');
  const renderer = getRenderer();

  if (!markdownBlocks.length) {
    return content;
  }

  markdownBlocks.each((idx, elem) => {
    const $elem = $(elem);
    const rawContent = $elem.html().toString();
    const content = marked(rawContent, { renderer: renderer });
    $elem.html(content);
  });

  return $.html().toString();
};

module.exports = { preload };
