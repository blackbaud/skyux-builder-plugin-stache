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
    let _skyAppConfig;
    const mockPlugin = {
      preload(content, resourcePath, skyAppConfig) {
        _content = content;
        _resourcePath = resourcePath;
        _skyAppConfig = skyAppConfig;
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
    const skyAppConfig = {};
    plugin.preload(content, resourcePath, skyAppConfig);
    expect(content.toString()).toEqual(_content.toString());
    expect(resourcePath).toEqual(_resourcePath);
    expect(skyAppConfig.toString()).toEqual(_skyAppConfig.toString());
  });

  it('should call the plugins in the expected order', () => {
    let callOrder = [];
    const mockPlugin = {
      preload(callNumber) {
        callNumber++;
        callOrder.push(callNumber);
        return callNumber;
      }
    };

    mock('./config', mockPlugin);
    mock('./json-data', mockPlugin);
    mock('./route-metadata', mockPlugin);
    mock('./include', mockPlugin);
    mock('./code-block', mockPlugin);
    mock('./template-reference-variable', mockPlugin);

    const plugin = new StacheEntryPlugin();
    plugin.preload(0, '', {});
    expect(callOrder).toEqual([1, 2, 3, 4, 5, 6]);
  })
});
