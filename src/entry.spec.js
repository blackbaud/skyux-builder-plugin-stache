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
