const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const shared = require('./utils/shared');
const jsonDataUtil = require('./utils/json-data');

const root = shared.resolveAssetsPath('includes');

const replace = (content) => {

  const $ = cheerio.load(content, shared.cheerioConfig);
  const $includes = $('stache-include');

  if (!$includes.length) {
    return content;
  }

  $includes.each((i, elem) => {
    const $elem = $(elem);
    const notInCodeBlock = $elem.parents('stache-code-block').length < 1;

    if (notInCodeBlock) {
      const fileName = jsonDataUtil.parseAngularBindings($elem.attr('fileName'));
      const filePath = path.join(root, fileName);
      // replace the fileName attribute with parsed fileName
      $elem.attr('fileName', () => {
        return fileName;
      });

      // Recursively calling replace method to handle possible nested includes.
      // Always calling replace since it'll short-circuit in the first if statement above.
      try {
        $elem.text(replace(fs.readFileSync(filePath)));
      } catch (error) {
        throw new shared.StachePluginError(error.message);
      }
    }
  });

  return $.html().toString();
}

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  return replace(content);
};

module.exports = { preload };
