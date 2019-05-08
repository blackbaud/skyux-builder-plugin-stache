const plugin = require('./json-data-element-attributes');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const mockData = fs.readFileSync(path.resolve(__dirname, './fixtures/mock-data.json'));

describe('JSON Data Element Attribute Plugin', () => {
  beforeAll(() => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not change the content of non HTML files', () => {
    const content = new Buffer('{{ @buildtime:stache.jsonData.mock_data.one }}');

    let result = plugin.preload(content, 'foo.js');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss');
    expect(result.toString()).toEqual(content.toString());
  });

  it('It should replace the pageTitle attribute on the stache tag if it contains a stache data value', () => {
    const content = new Buffer('<stache pageTitle="{{ stache.jsonData.mock_data.title }}"></stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache pageTitle="Test Title"></stache>');
  });

  it('It should replace the navTitle attribute on the stache tag if it contains a stache data value', () => {
    const content = new Buffer('<stache navTitle="{{ stache.jsonData.mock_data.title }}"></stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache navTitle="Test Title"></stache>');
  });

  it('It should not replace any non specified attributes', () => {
    const content = new Buffer('<stache-code-block languageType="{{ stache.jsonData.mock_data.one }}"></stache-code-block>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual(content.toString());
  });

  it('It should not replace any non specified attributes', () => {
    const content = new Buffer('<sky-code-block languageType="{{ stache.jsonData.mock_data.one }}"></sky-code-block>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual(content.toString());
  });
});
