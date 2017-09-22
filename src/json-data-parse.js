const jsonDataUtil = require('./utils/json-data');

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return jsonDataUtil.parseAllBuildTimeBindings(content);
  }

  return content;
};

module.exports = { preload };
