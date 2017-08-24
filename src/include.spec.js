const fs = require('fs-extra');
const plugin = require('./include');
const shared = require('./shared');

describe('Include Plugin', () => {
  beforeAll(() => {
    spyOn(shared, 'resolveAssetsPath').and.returnValue('');
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = new Buffer('let foo = "bar";');
    const resourcePath = 'foo.js';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should not alter the content if the html file does not include any <stache include> tags.', () => {
    const content = new Buffer('<p></p>');
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should convert the inner HTML of all <stache-include> to the referenced file.', () => {
    const includeContents = '<h1>Test</h1>';
    spyOn(fs, 'readFileSync').and.returnValue(includeContents);
    const content = new Buffer(`<stache-include fileName="test.html"></stache-include>`);
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toContain(includeContents);
  });

  it('should throw an error if the file is not found.', () => {
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    const resourcePath = 'invalid.html';
    const content = new Buffer(`<stache-include fileName="${resourcePath}"></stache-include>`);

    try {
      plugin.preload(content, resourcePath);
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(plugin.preload).toThrowError(shared.StachePluginError);
    }
  });

  it('should support nested includes', () => {
    const includeComponent = '<stache-include fileName="test2.html"></stache-include>';
    const includeContents1 = '<h1>Test1</h1>';
    const includeContents2 = '<h1>Test2</h1>';

    spyOn(fs, 'readFileSync').and.callFake(file => {
      if (file.indexOf('test1.html') > -1) {
        return includeContents1 + includeComponent;
      }

      if (file.indexOf('test2.html') > -1) {
        return includeContents2;
      }

      return '';
    });

    const content = new Buffer(`<stache-include fileName="test1.html"></stache-include>`);
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toContain(includeContents1);
    expect(result.toString()).toContain(includeContents2);
  })
});
