const shared = require('./shared');
// matches providers: [] including new lines between the [].
const providersArrayRegExp = new RegExp(/providers\s*:\s*?\[([\s\S]*?).*?\]/g);
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

  it('should add the providers array to the @ngModule.', () => {
    const content = new Buffer(`
      @NgModule({
        imports: [
          StacheModule
        ],
        exports: [
          StacheModule
        ]
      });`
    );
    const withProviders = shared.addToProviders(content, 'SOME_PROVIDERS');
    expect(withProviders).toContain(`
      @NgModule({
        providers: [
      /* tslint:disable:trailing-comma */
      SOME_PROVIDERS,
      /* tslint:enable:trailing-comma */
  ]`);
    expect(providersArrayRegExp.test(content.toString())).toBe(false);
    expect(providersArrayRegExp.test(withProviders)).toBe(true);
  });

  it('should add the providers array only if one does not exist in any format', () => {
    const content1 = new Buffer(`
      @NgModule({
        providers: [],
        imports: [],
        exportsL []
      })
    `);

    const content2 = new Buffer(`
      @NgModule({
        providers:[        ],
        imports: [],
        exportsL []
      })
    `);

    const content3 = new Buffer(`
      @NgModule({
        providers          : [ ],
        imports: [],
        exportsL []
      })
    `);

    const content4 = new Buffer(`
      @NgModule({
        providers          :
          [ ],
        imports: [],
        exportsL []
      })
    `);

    const content5 = new Buffer(`
      @NgModule({
        imports: [],
        exports: []
      })
    `);

    const testContent1 = shared.addToProviders(content1, 'SOME_PROVIDERS');
    const testContent2 = shared.addToProviders(content2, 'SOME_PROVIDERS');
    const testContent3 = shared.addToProviders(content3, 'SOME_PROVIDERS');
    const testContent4 = shared.addToProviders(content4, 'SOME_PROVIDERS');
    const testContent5 = shared.addToProviders(content5, 'SOME_PROVIDERS');

    const originalContent1Match = content1.toString().match(providersArrayRegExp);
    const originalContent5Match = content5.toString().match(providersArrayRegExp);
    const content1Matches = testContent1.toString().match(providersArrayRegExp);
    const content2Matches = testContent2.toString().match(providersArrayRegExp);
    const content3Matches = testContent3.toString().match(providersArrayRegExp);
    const content4Matches = testContent4.toString().match(providersArrayRegExp);
    const content5Matches = testContent5.toString().match(providersArrayRegExp);

    expect(originalContent1Match.length).toBe(1);
    expect(originalContent5Match).toBe(null);
    expect(content1Matches.length).toBe(1);
    expect(content2Matches.length).toBe(1);
    expect(content3Matches.length).toBe(1);
    expect(content4Matches.length).toBe(1);
    expect(content5Matches.length).toBe(1);
  });

  it('should add a provider string to the providers array in file\'s contents', () => {
    const content = new Buffer('providers: []');
    const result = shared.addToProviders(content, 'SOME_PROVIDERS');
    expect(result).toContain('SOME_PROVIDERS');
  });

  it('should return a resolved module path depending on its location', () => {
    let config = { skyux: { name: 'not-stache' }};
    let result = shared.getModulePath('/src/app/index.html', config);
    expect(result).toBe('@blackbaud/stache');

    config = { skyux: { name: 'stache2' }};
    result = shared.getModulePath('/src/app/index.html', config);
    expect(result).toBe('./public');

    // Windows:
    result = shared.getModulePath(String.raw`\stache2\src\app\index.html`, config);
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

  it('should convert a string to use HTML entities for specific characters', () => {
    const rawContent = '<div> { var } </div>';
    const content = shared.convertToHTMLEntities(rawContent);
    expect(content).toEqual('&lt;div> {{ \'{\' }} var } &lt;/div>');
  });
});
