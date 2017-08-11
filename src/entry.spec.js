const mock = require('mock-require');
const StacheEntryPlugin = require('./entry');
const shared = require('./shared');

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

    mock('./config', mockPlugin);
    mock('./include', mockPlugin);
    mock('./code-block', mockPlugin);
    mock('./json-data', mockPlugin);
    mock('./route-metadata', mockPlugin);
    mock('./template-reference-variable', mockPlugin);

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
    mock('./config', {
      preload() {
        callOrder.push(1);
      }
    });

    mock('./json-data', {
      preload() {
        callOrder.push(4);
      }
    });

    mock('./route-metadata', {
      preload() {
        callOrder.push(5);
      }
    });

    mock('./include', {
      preload() {
        callOrder.push(2);
      }
    });

    mock('./code-block', {
      preload() {
        callOrder.push(3);
      }
    });

    mock('./template-reference-variable', {
      preload() {
        callOrder.push(6);
      }
    });

    const plugin = new StacheEntryPlugin();
    const content = new Buffer('Content');

    plugin.preload(content, 'foo.html', {});

    expect(callOrder).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should throw an error if an error is thrown from a plugin', () => {
    mock('./config', {
      preload() {
        throw new shared.StachePluginError('invalid plugin');
      }
    });

    const content = new Buffer('');
    const plugin = new StacheEntryPlugin();

    try {
      plugin.preload(content, '', {});
    } catch (error) {
      expect(plugin.preload).toThrowError(shared.StachePluginError);
      expect(error.message).toEqual('invalid plugin');
    }
  });
});
