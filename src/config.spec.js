const plugin = require('./config');

describe('Config Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });
});
