const plugin = require('./auth-http');

describe('Auth Http Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts');
    expect(result.toString()).toContain('STACHE_AUTH_HTTP_PROVIDERS');
  });

  it('should not change the content of other files', () => {
    const content = new Buffer('');

    let result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.js');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss');
    expect(result.toString()).toEqual(content.toString());
  });
});
