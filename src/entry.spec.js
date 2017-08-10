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
    const mockPlugin = {
      preload(content, resourcePath, skyPagesConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyPagesConfig = skyPagesConfig;
        return content;
      }
    };

    mock('./config.js', mockPlugin);
    mock('./include', mockPlugin);
    mock('./code-block.js', mockPlugin);
    mock('./json-data.js', mockPlugin);
    mock('./route-metadata.js', mockPlugin);
    mock('./template-reference-variable.js', mockPlugin);

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
      }
    });

    mock('./json-data.js', {
      preload() {
        callOrder.push(4);
      }
    });

    mock('./route-metadata.js', {
      preload() {
        callOrder.push(5);
      }
    });

    mock('./include', {
      preload() {
        callOrder.push(2);
      }
    });

    mock('./code-block.js', {
      preload() {
        callOrder.push(3);
      }
    });

    mock('./template-reference-variable.js', {
      preload() {
        callOrder.push(6);
      }
    });

    const plugin = new StacheEntryPlugin();
    const content = new Buffer('Content');

    plugin.preload(content, 'foo.html', {});

    expect(callOrder).toEqual([1, 2, 3, 4, 5, 6]);
  })
});
