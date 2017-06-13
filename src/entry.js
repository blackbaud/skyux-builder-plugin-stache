const glob = require('glob');
const shared = require('./shared');
const path = require('path');

const preload = (content, resourcePath, skyPagesConfig) => {
  const pluginPaths = glob.sync(
    './src/*.js',
    {
      ignore: ['./*.spec.js'],
      cwd: __dirname
    }
  );

  pluginPaths.forEach(pluginPath => {
    try {
      const plugin = require(path.resolve(__dirname, pluginPath));
      const altered = plugin.preload(content, resourcePath, skyPagesConfig);

      if (content !== altered) {
        content = altered;
      }
    } catch (error) {
      console.error(new shared.StachePluginError(error.message));
    }
  });

  return content;
};

module.exports = {
  preload
};
