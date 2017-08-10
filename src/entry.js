function StacheEntryPlugin() {
  const preload = (content, resourcePath, skyPagesConfig) => {
    const preloadPluginOrder = [
      require('./config'),
      require('./include'),
      require('./code-block'),
      require('./json-data'),
      require('./route-metadata'),
      require('./template-reference-variable')
    ];

    preloadPluginOrder.forEach(plugin => {
      content = plugin.preload(content, resourcePath, skyPagesConfig);
    });

    return content;
  };

  return Object.freeze({ preload });
}

module.exports = StacheEntryPlugin;
