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
    const content = 'let foo = "bar";';
    const resourcePath = 'foo.js';
    const result = plugin.preload(content, resourcePath);
    expect(result).toBe(content);
  });

  it('should not alter the content if the html file does not include any <stache include> tags.', () => {
    const content = '<p></p>';
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result).toBe(content);
  });

  it('should convert the inner HTML of all <stache-include> to the referenced file.', () => {
    const includeContents = '<h1>Test</h1>';
    spyOn(fs, 'readFileSync').and.returnValue(includeContents);
    const content = `<stache-include fileName="test.html"></stache-include>`;
    const resourcePath = 'foo.html';
    const result = plugin.preload(content, resourcePath);
    expect(result).toContain(includeContents);
  });

  it('should throw an error if the file is not found.', () => {
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    const resourcePath = 'invalid.html';
    const content = `<stache-include fileName="${resourcePath}"></stache-include>`;

    try {
      plugin.preload(content, resourcePath);
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(plugin.preload).toThrowError(shared.StachePluginError);
    }
  });
});
