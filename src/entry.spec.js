const glob = require('glob');
const mock = require('mock-require');
const path = require('path');
const shared = require('./shared');

describe('Entry Plugin', () => {
  const pluginPath = './entry';

  afterEach(() => {
    mock.stopAll();
  });

  it('should contain a preload hook', () => {
    const plugin = require(pluginPath);
    expect(plugin.preload).toBeDefined();
  });

  it('should abort if no plugins exist', () => {
    spyOn(glob, 'sync').and.returnValue([]);
    const plugin = require(pluginPath);
    const result = plugin.preload('', '', {});
    expect(result).toBe('');
    mock.stop('glob');
  });

  it('should pass its arguments into the other plugins', () => {
    let _content;
    let _resourcePath;
    let _skyAppConfig;

    spyOn(glob, 'sync').and.returnValue(['my-plugin.js']);
    spyOn(path, 'resolve').and.returnValue('my-plugin.js');
    mock('my-plugin.js', {
      preload: (content, resourcePath, skyAppConfig) => {
        _content = content;
        _resourcePath = resourcePath;
        _skyAppConfig = skyAppConfig;
      }
    });

    const plugin = require(pluginPath);
    plugin.preload('<p></p>', 'foo.html', {});

    expect(_content).toBe('<p></p>');
    expect(_resourcePath).toBe('foo.html');
    expect(_skyAppConfig).toEqual(jasmine.any(Object));
  });

  it('should abort if the plugin does not have a preload method', () => {
    spyOn(glob, 'sync').and.returnValue(['my-plugin.js']);
    spyOn(path, 'resolve').and.returnValue('my-plugin.js');
    mock('my-plugin.js', {
      postload: () => { }
    });

    const plugin = require(pluginPath);
    const result = plugin.preload('', '', {});

    expect(result).toEqual('');
  });

  it('should abort if the plugin does not change the file\'s content', () => {
    spyOn(glob, 'sync').and.returnValue(['my-plugin.js']);
    spyOn(path, 'resolve').and.returnValue('my-plugin.js');
    mock('my-plugin.js', {
      preload: (content) => {
        return content;
      }
    });

    const plugin = require(pluginPath);
    const result = plugin.preload('', '', {});

    expect(result).toEqual('');
  });

  it('should throw an error if the plugin is not found', () => {
    spyOn(glob, 'sync').and.returnValue(['invalid.js']);
    spyOn(path, 'resolve').and.returnValue('invalid.js');
    const plugin = require(pluginPath);

    try {
      plugin.preload('', '', {});
    } catch (error) {
      expect(error).toEqual(jasmine.any(shared.StachePluginError));
    }
  });
});
