const shared = require('./utils/shared');

function StacheEntryPlugin() {
  const preload = (content, resourcePath, skyPagesConfig) => {
    try {
      // This load order for these plugins is necessary and intentional. Do not change without good reason.
      // For more information reference the README.
      const preloadPluginOrder = [
        require('./config'),
        require('./http'),
        require('./include'),
        require('./json-data-element-attributes'),
        require('./json-data-build-time'),
        require('./markdown'),
        require('./code-block'),
        require('./code'),
        require('./json-data'),
        require('./route-metadata'),
        require('./template-reference-variable')
      ];

      preloadPluginOrder.forEach(plugin => {
        content = plugin.preload(content, resourcePath, skyPagesConfig);
      });
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

    return content;
  };

  const runCommand = (command, argv) => {
    switch(command) {
      case 'stache-update':
      require('./update-dependencies')(argv);
      break;
      default:
      return false;
    }
    return true;
  };

  return Object.freeze({ preload, runCommand });
}

module.exports = StacheEntryPlugin;
