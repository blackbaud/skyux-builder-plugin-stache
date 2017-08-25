const plugin = require('./json-data');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const mockData = fs.readFileSync(path.resolve(__dirname, './fixtures/mock-data.json'));

describe('JSON Data Plugin', () => {
  beforeAll(() => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts');
    expect(result.toString()).toContain('STACHE_JSON_DATA_PROVIDERS');
  });

  it('should not change the content of other files', () => {
    const content = new Buffer('{{ @buildtime:stache.jsonData.mock_data.one }}');

    let result = plugin.preload(content, 'foo.js');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss');
    expect(result.toString()).toEqual(content.toString());
  });

  it('It should add an elvis operator to stache jsonData bindings in html pages', () => {
    const content = new Buffer('<div> {{ stache.jsonData.globals.productNameLong }} </div>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<div> {{ stache.jsonData?.globals.productNameLong }} </div>');
  });
});
