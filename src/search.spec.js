const plugin = require('./search');

describe('Search Provider Plugin', () => {
  let config;
  beforeEach(() => {
    config = {
      skyux: {
        appSettings: {
          stache: {
            searchConfig: {
              enableSearchBeta: true
            }
          }
        }
      }
    };
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('STACHE_SEARCH_RESULTS_PROVIDERS');
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

  it('should return if enable search beta is undefined', () => {
    config.skyux.appSettings.stache.searchConfig.enableSearchBeta = undefined;
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).not.toContain('STACHE_SEARCH_RESULTS_PROVIDERS');
  });

  it('should return if enable search beta is false', () => {
    config.skyux.appSettings.stache.searchConfig.enableSearchBeta = false;
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).not.toContain('STACHE_SEARCH_RESULTS_PROVIDERS');
  });
});
