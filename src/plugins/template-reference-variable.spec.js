const plugin = require('./template-reference-variable');

describe('Template Reference Variable Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = new Buffer.from('let foo = "bar";');
    const path = 'foo.js';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should add the template reference variable to each <stache> tag', () => {
    const content = new Buffer.from('<stache></stache>');
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual('<stache #stache></stache>');
  });

  it('should not add the attribute if no stache tag exists', () => {
    const content = new Buffer.from('<h1>No attribute</h1>');
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });
});
