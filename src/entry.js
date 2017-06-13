const glob = require('glob');
const path = require('path');
const shared = require('./shared');

const preload = (content, resourcePath, skyPagesConfig) => {
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

  if (!pluginPaths.length) {
    return content;
  }

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
      throw new shared.StachePluginError(error.message);
    }
  });

  return content;
};

module.exports = {
  preload
};
