const shared = require('./services/shared');
const stacheJsonDataService = require('./services/stache-json-data.service');

function StacheEntryPlugin() {
  const preload = (content, resourcePath, skyPagesConfig) => {
    try {
      const preloadPluginOrder = [
        require('./config'),
        require('./include'),
        require('./code-block'),
        require('./json-data'),
        require('./route-metadata'),
        require('./template-reference-variable')
      ];

      if (!stacheJsonDataService.getStacheDataObject()) {
        stacheJsonDataService.setStacheDataObject();
      }

      preloadPluginOrder.forEach(plugin => {
        content = plugin.preload(content, resourcePath, skyPagesConfig);
      });
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }

    return content;
  };

  return Object.freeze({ preload });
}

module.exports = StacheEntryPlugin;
