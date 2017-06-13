const plugin = require('./template-reference-variable');

describe('Template Reference Variable Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = 'let foo = "bar";';
    const path = 'foo.js';
    let result = plugin.preload(content, path);
    expect(result).toBe(content);
  });

  it('should add the template reference variable to each <stache> tag', () => {
    const content = '<stache></stache>';
    const path = 'foo.html';
    let result = plugin.preload(content, path);
    expect(result).toBe('<stache #stache=""></stache>');
  });

  it('should not add the attribute if no stache tag exists', () => {
    const content = '<h1>No attribute</h1>';
    const path = 'foo.html';
    let result = plugin.preload(content, path);
    expect(result).toBe(content);
  });
});
