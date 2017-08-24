const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const shared = require('./shared');

const root = shared.resolveAssetsPath('includes');

const replace = (content) => {

  const $html = cheerio.load(content, shared.cheerioConfig);
  const $includes = $html('stache-include');

  if (!$includes.length) {
    return content;
  }

  $includes.each((i, elem) => {
    const $elem = $html(elem);
    const fileName = $elem.attr('fileName');
    const filePath = path.join(root, fileName);

    // Recursively calling replace method to handle possible nested includes.
    // Always calling replace since it'll short-circuit in the first if statement above.
    try {
      $elem.text(replace(fs.readFileSync(filePath)));
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

  });

  return $html.html().toString();
}

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  return replace(content);
};

module.exports = { preload };
