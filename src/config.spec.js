const plugin = require('./config');

describe('Config Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    const result = plugin.preload('', 'app-extras.module.ts');
    expect(result).toContain('STACHE_CONFIG_PROVIDERS');
  });

  it('should not change the content of other files', () => {
    let result = plugin.preload('', 'foo.html');
    expect(result).toBe('');

    result = plugin.preload('', 'foo.js');
    expect(result).toBe('');

    result = plugin.preload('', 'foo.scss');
    expect(result).toBe('');
  });
});
