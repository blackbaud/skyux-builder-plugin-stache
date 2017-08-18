const plugin = require('./json-data-build-time');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const mockData = fs.readFileSync(path.resolve(__dirname, './fixtures/mock-data.json'));

describe('JSON Data Build Time Plugin', () => {
  beforeAll(() => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not change the content of other files', () => {
    const content = new Buffer('{{ @buildtime:stache.jsonData.mock_data.one }}');

    let result = plugin.preload(content, 'foo.js');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss');
    expect(result.toString()).toEqual(content.toString());
  });

  it('should replace all all {{ @buildtime:stache.jsonData.* }} bindings.', () => {
    const content = new Buffer(`
    <stache pageTitle="{{ @buildtime:stache.jsonData.mock_data.title}}">
      <div> {{ @buildtime:stache.jsonData.mock_data.one }} </div>
    </stache>
    `);

    let result = plugin.preload(content, 'foo.html');

    expect(result.toString()).toEqual(`
    <stache pageTitle="Test Title">
      <div> One </div>
    </stache>
    `);
  });

  it('should not replace any non @buildtime: stache.jsonData bindings.', () => {
    const content = new Buffer(`{{ @buildtime:stache.jsonData.mock_data.one}} {{ stache.jsonData.mock_data.one }}`);
    let result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('One {{ stache.jsonData.mock_data.one }}');
  });
});
