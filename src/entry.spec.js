const glob = require('glob');
const mock = require('mock-require');
const path = require('path');
const shared = require('./shared');
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
    const plugin = new StacheEntryPlugin();
    const content = new Buffer('');
    plugin.preload(content, '', {});
    expect(plugin.preload).toBeDefined();
  })
});
