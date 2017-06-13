const plugin = require('./entry');

describe('Entry Plugin', () => {
  it('should', () => {
    plugin.preload('', '');
    expect(plugin.preload).toBeDefined();
  });
});
