const glob = require('glob');
const shared = require('./shared');
const path = require('path');

const pluginPaths = glob.sync(
  '*.js',
  {
    ignore: [
      '*.spec.js',
      'entry.js',
      'shared.js'
    ],
    cwd: __dirname
  }
);

const preload = (content, resourcePath, skyPagesConfig) => {
  pluginPaths.forEach(pluginPath => {
    try {
      const plugin = require(path.resolve(__dirname, pluginPath));

      if (!plugin.preload) {
        return;
      }

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
