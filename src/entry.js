const glob = require('glob');
const path = require('path');
const shared = require('./shared');

function StacheEntryPlugin() {
  let _pluginPaths = glob.sync(
    './*.js',
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
    if (!_pluginPaths.length) {
      return content;
    }

    _pluginPaths.forEach(pluginPath => {
      try {
        const plugin = require(pluginPath);

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

  return Object.freeze({ preload });
}

module.exports = StacheEntryPlugin;
