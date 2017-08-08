const glob = require('glob');
const shared = require('./shared');

function StacheEntryPlugin() {
  let _pluginPaths = glob.sync(
    './*.js',
    {
      ignore: [
        './*.spec.js',
        './entry.js',
        './shared.js'
      ],
      cwd: __dirname
    }
  );

  const sortByPluginOrder = (a, b) => {
    if ((a.pluginOrder < b.pluginOrder ) || (a.pluginOrder && !b.pluginOrder)) {
      return -1;
    } else if (a.pluginOrder > b.pluginOrder || (!a.pluginOrder && b.pluginOrder)) {
      return 1;
    } else {
      return 0;
    }
  };

  const loadPlugins = (paths) => {
    const plugins = [];
    paths.forEach(pluginPath => {
      try {
        let plugin = require(pluginPath);
        plugins.push(plugin);
      }
      catch (error) {
        throw new shared.StachePluginError(error.message);
      }
    });

    return plugins.sort(sortByPluginOrder);
  };

  const preload = (content, resourcePath, skyPagesConfig) => {
    if (!_pluginPaths.length) {
      return content;
    }

    const plugins = loadPlugins(_pluginPaths);

    plugins.forEach(plugin => {
      if (!plugin.preload) {
        return;
      }

      const altered = plugin.preload(content, resourcePath, skyPagesConfig);

      if (content !== altered) {
        content = altered;
      }
    });

    return content;
  };

  return Object.freeze({ loadPlugins, preload, sortByPluginOrder });
}

module.exports = StacheEntryPlugin;
