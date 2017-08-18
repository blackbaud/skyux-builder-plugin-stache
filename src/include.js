const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const shared = require('./utils/shared');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  const $ = cheerio.load(content, shared.cheerioConfig);
  const includes = $('stache-include');

  if (!includes.length) {
    return content;
  }

  const root = shared.resolveAssetsPath('includes');

  includes.each((idx, elem) => {
    const $elem = $(elem);
    const fileName = $elem.attr('fileName');
    const filePath = path.join(root, fileName);

    let contents;

    try {
      contents = fs.readFileSync(filePath);
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

    $elem.text(contents);
  });

  return $.html().toString();
};

module.exports = { preload };
