const shared = require('./shared');

describe('Shared methods and properties', () => {
  it('should exist', () => {
    expect(shared).toBeDefined();
  });

  it('should export StachePluginError', () => {
    expect(shared.StachePluginError).toBeDefined();
  });

  it('should export cheerio config', () => {
    expect(shared.cheerioConfig).toEqual(jasmine.any(Object));
  });

  it('should export addToProviders', () => {
    expect(shared.addToProviders).toEqual(jasmine.any(Function));
  });

  it('should export getModulePath', () => {
    expect(shared.getModulePath).toEqual(jasmine.any(Function));
  });

  it('should export resolveAssetsPath', () => {
    expect(shared.resolveAssetsPath).toEqual(jasmine.any(Function));
  });

  it('should add a provider string to the providers array in file\'s contents', () => {
    const content = new Buffer('providers: []');
    const result = shared.addToProviders(content, 'SOME_PROVIDERS');
    expect(result).toContain('SOME_PROVIDERS');
  });

  it('should return a resolved module path depending on its location', () => {
    let result = shared.getModulePath('/my-spa/src/app/index.html');
    expect(result).toBe('@blackbaud/stache');

    result = shared.getModulePath('/stache2/src/app/index.html');
    expect(result).toBe('./public');
  });

  it('should resolve a directory for Stache assets folder', () => {
    let result = shared.resolveAssetsPath('foo');
    expect(result.endsWith('src/stache/foo')).toBe(true);

    result = shared.resolveAssetsPath('foo', 'bar');
    expect(result.endsWith('src/stache/foo/bar')).toBe(true);
  });

  it('should export an error object with a default message', () => {
    const result = new shared.StachePluginError();
    expect(result.message).toEqual('Plugin failure.');
  });
});
