const plugin = require('./http');

describe('Auth Http Plugin', () => {
  let config;
  beforeEach(() => {
    config = {
      skyux: {
        auth: true
      }
    };
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('STACHE_HTTP_PROVIDERS');
  });

  it('should not change the content of other files', () => {
    const content = new Buffer('');

    let result = plugin.preload(content, 'foo.html', config);
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.js', config);
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss', config);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should inject the angular http library if auth is not true', () => {
    config.skyux.auth = false;
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('@angular/http');
  });

  it('should inject the sky auth http library if auth is true', () => {
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('@blackbaud/skyux-builder/runtime');
  });
});
