// const cheerio = require('cheerio');
const glob = require('glob');
// const shared = require('./shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!resourcePath.match(/app-extras\.module\.ts$/)) {
    return content;
  }

  if (!skyPagesConfig.runtime.routes) {
    return content;
  }

  const htmlPaths = glob.sync('**/*.html');

  console.log(htmlPaths);

  // const $ = cheerio.load(content, shared.cheerioConfig);

  // const stacheTags = $('stache');
};

module.exports = {
  preload
};
