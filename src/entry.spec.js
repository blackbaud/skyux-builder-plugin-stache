const mock = require('mock-require');
const StacheEntryPlugin = require('./entry');

describe('Entry Plugin', () => {
  afterEach(() => {
    mock.stopAll();
  });

  it('should contain a preload hook', () => {
    const plugin = new StacheEntryPlugin();
    expect(plugin.preload).toBeDefined();
  });

  it('should pass the content through all plugins', () => {
    let _content;
    let _resourcePath;
    let _skyPagesConfig;
    mock('./config.js', {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    });

    mock('./include', {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    });

    mock('./code-block.js', {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    });

    mock('./json-data.js', {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    });

    mock('./route-metadata.js', {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    });

    mock('./template-reference-variable.js', {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    });

    const plugin = new StacheEntryPlugin();
    const content = new Buffer('Content');
    const resourcePath = 'foo.html';
    const skyPagesConfig = {};
    plugin.preload(content, resourcePath, skyPagesConfig);
    expect(content.toString()).toEqual(_content.toString());
    expect(resourcePath).toEqual(_resourcePath);
    expect(skyPagesConfig.toString()).toEqual(_skyPagesConfig.toString());
  });

  it('should call the plugins in the expected order', () => {
    let callOrder = [];
    mock('./config.js', {
      preload() {
        callOrder.push(1);
        return content;
      }
    });

    mock('./json-data.js', {
      preload() {
        callOrder.push(4);
        return content;
      }
    });

    mock('./route-metadata.js', {
      preload() {
        callOrder.push(5);
        return content;
      }
    });

    mock('./include', {
      preload() {
        callOrder.push(2);
        return content;
      }
    });

    mock('./code-block.js', {
      preload() {
        callOrder.push(3);
        return content;
      }
    });

    mock('./template-reference-variable.js', {
      preload() {
        callOrder.push(6);
        return content;
      }
    });

    const plugin = new StacheEntryPlugin();
    const content = new Buffer('Content');
    plugin.preload(content, 'foo.html', {});
    expect(callOrder).toEqual([1, 2, 3, 4, 5, 6]);
  })
});
