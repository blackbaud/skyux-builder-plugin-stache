const jsonDataUtil = require('./utils/json-data');

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return editHTMLContent(content);
  }

  return content;
};

const editHTMLContent = (content) => {
  return jsonDataUtil.parseAllBuildTimeBindings(content.toString());
};

module.exports = { preload };
