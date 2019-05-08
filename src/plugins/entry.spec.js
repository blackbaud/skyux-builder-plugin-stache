const mock = require('mock-require');
const StacheEntryPlugin = require('./entry');
const shared = require('./utils/shared');

describe('Entry Plugin', () => {
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

  beforeEach(() => {
    mock('./include', mockPlugin);
    mock('./json-data-element-attributes', mockPlugin);
    mock('./json-data-build-time', mockPlugin);
    mock('./markdown', mockPlugin);
    mock('./code', mockPlugin);
    mock('./json-data', mockPlugin);
    mock('./route-metadata', mockPlugin);
    mock('./template-reference-variable', mockPlugin);
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should contain a preload hook', () => {
    const plugin = new StacheEntryPlugin();
    expect(plugin.preload).toBeDefined();
  });

  it('should pass the content through all plugins', () => {
    const plugin = new StacheEntryPlugin();
    const content = new Buffer.from('Content');
    const resourcePath = 'foo.html';
    const skyPagesConfig = {};

    plugin.preload(content, resourcePath, skyPagesConfig);

    expect(content.toString()).toEqual(_content.toString());
    expect(resourcePath).toEqual(_resourcePath);
    expect(skyPagesConfig.toString()).toEqual(_skyPagesConfig.toString());
  });

  it('should call the plugins in the expected order', () => {
    mock.stopAll();
    let callOrder = [];

    mock('./json-data', {
      preload() {
        callOrder.push('json-data');
      }
    });

    mock('./json-data-element-attributes', {
      preload() {
        callOrder.push('json-data-element-attributes');
      }
    });

    mock('./http', {
      preload() {
        callOrder.push('http');
      }
    }),

    mock('./json-data-build-time', {
      preload() {
        callOrder.push('json-data-build-time');
      }
    });

    mock('./route-metadata', {
      preload() {
        callOrder.push('route-metadata');
      }
    });

    mock('./include', {
      preload() {
        callOrder.push('include');
      }
    });

    mock('./markdown', {
      preload() {
        callOrder.push('markdown');
      }
    });

    mock('./code', {
      preload() {
        callOrder.push('code');
      }
    });

    mock('./template-reference-variable', {
      preload() {
        callOrder.push('template-reference-variable');
      }
    });

    const plugin = new StacheEntryPlugin();
    const content = new Buffer.from('Content');

    plugin.preload(content, 'foo.html', {});

    expect(callOrder).toEqual([
      'include',
      'json-data-element-attributes',
      'json-data-build-time',
      'markdown',
      'code',
      'json-data',
      'route-metadata',
      'template-reference-variable'
    ]);
  });

  it('should throw an error if an error is thrown from a plugin', () => {
    mock.stop('./code');
    mock('./code', {
      preload() {
        throw new shared.StachePluginError('invalid plugin');
      }
    });

    const content = new Buffer.from('');
    const plugin = new StacheEntryPlugin();

    try {
      plugin.preload(content, '', {});
    } catch (error) {
      expect(plugin.preload).toThrowError(shared.StachePluginError);
      expect(error.message).toEqual('invalid plugin');
    }
  });
});
