const fs = require('fs-extra');
const plugin = require('./include');
const shared = require('./utils/shared');
const jsonDataUtil = require('./utils/json-data');

describe('Include Plugin', () => {
  beforeAll(() => {
    spyOn(shared, 'resolveAssetsPath').and.returnValue('');
    spyOn(jsonDataUtil, 'parseAngularBindings').and.callFake(binding => {
      if (binding.indexOf('mockFileOne') > -1) {
        return 'test1.html'
      }

      if (binding.indexOf('mockFileTwo') > -1) {
        return 'test2.html'
      }

      return binding;
    });
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = new Buffer.from('let foo = "bar";');
    const resourcePath = 'foo.js';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should not alter the content if the html file does not include any <stache-include> tags.', () => {
    const content = new Buffer.from('<p></p>');
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should convert the inner HTML of all <stache-include> to the referenced file.', () => {
    const includeContents = '<h1>Test</h1>';
    spyOn(fs, 'readFileSync').and.returnValue(includeContents);
    const content = new Buffer.from(`<stache-include fileName="test.html"></stache-include>`);
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toContain(includeContents);
  });

  it('should not convert stache-include tags inside of a sky-code-block.', () => {
    const includeContents = '<h1>Test</h1>';
    spyOn(fs, 'readFileSync').and.returnValue(includeContents);
    const content = new Buffer.from(`
      <sky-code-block>
        <stache-include fileName="test.html"></stache-include>
      </sky-code-block>
    `);
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).not.toContain(includeContents);
    expect(result.toString()).toEqual(content.toString());
  });

  it('It should replace stache.jsonData bindings in the fileName with the data value', () => {
    const content = new Buffer.from('<stache-include fileName="{{ stache.jsonData.mock_data.mockFileOne }}"></stache-include>');
    const includeContents = '<h1>Test1</h1>';
    spyOn(fs, 'readFileSync').and.returnValue(includeContents);
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache-include fileName="test1.html"><h1>Test1</h1></stache-include>');
  });

  it('should throw an error if the file is not found.', () => {
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    const resourcePath = 'invalid.html';
    const content = new Buffer.from(`<stache-include fileName="${resourcePath}"></stache-include>`);

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
    });

    const content = new Buffer.from(`<stache-include fileName="test1.html"></stache-include>`);
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toContain(includeContents1);
    expect(result.toString()).toContain(includeContents2);
  });

  it('should support nested includes that use stache.jsonData bindings as fileNames', () => {
    const includeComponent = '<stache-include fileName="{{ stache.jsonData.mock_data.mockFileTwo }}"></stache-include>';
    const includeContents1 = '<h1>Test1</h1>';
    const includeContents2 = '<h1>Test2</h1>';

    spyOn(fs, 'readFileSync').and.callFake(file => {
      if (file.indexOf('test1.html') > -1) {
        return includeContents1 + includeComponent;
      }

      if (file.indexOf('test2.html') > -1) {
        return includeContents2;
      }
    });

    const content = new Buffer.from(`<stache-include fileName="{{ stache.jsonData.mock_data.mockFileOne }}"></stache-include>`);
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result.toString()).toContain(includeContents1);
    expect(result.toString()).toContain(includeContents2);
  });
});
