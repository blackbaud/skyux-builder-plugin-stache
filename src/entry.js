const glob = require('glob');
const shared = require('./shared');

function StacheEntryPlugin() {
  const preload = (content, resourcePath, skyPagesConfig) => {
    const preloadPluginOrder = [
      require('./config.js'),
      require('./include.js'),
      require('./code-block.js'),
      require('./json-data.js'),
      require('./route-metadata.js'),
      require('./template-reference-variable.js')
    ];

    preloadPluginOrder.forEach(plugin => {
      content = plugin.preload(content, resourcePath, skyPagesConfig);
    });

    return content;
  };

  return Object.freeze({ preload });
}

module.exports = StacheEntryPlugin;
