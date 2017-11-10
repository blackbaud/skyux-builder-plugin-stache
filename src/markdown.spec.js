const plugin = require('./markdown');

describe('Markdown Plugin', () => {
  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = new Buffer('let foo = "bar";');
    const path = 'foo.js';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should alter the content if the html file does not include any <stache-markdown> tags.', () => {
    const content = new Buffer('<p></p>');
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should convert the inner markdown of all <stache-markdown> to HTML.', () => {
    const content = new Buffer(`
<stache-markdown>
- Item 1
- Item 2
</stache-markdown>
`);
    const path = 'foo.html';
    const result = plugin.preload(content, path).toString();
    expect(result).toContain(
`<ul>
<li>Item 1</li>
<li>Item 2</li>
</ul>`);
  });

  it('should use a custom renderer for headings, code-blocks, code', () => {
    const content = new Buffer(`
<stache-markdown>
# Heading 1

## Heading 2
</stache-markdown>

<stache-markdown>
\`\`\`js
JS-code
\`\`\`
</stache-markdown>

<stache-markdown>

This is an \`inline\` code example.

</stache-markdown>
`);
    const path = 'foo.html';
    const result = plugin.preload(content, path).toString();
    expect(result).toContain(
`<stache-page-anchor level="1">
Heading 1
</stache-page-anchor>
<stache-page-anchor level="2">
Heading 2
</stache-page-anchor>`);

    expect(result).toContain(
`<stache-code-block languageType="js">
JS-code
</stache-code-block>
`);

    expect(result).toContain(`<p>This is an <stache-code>inline</stache-code> code example.</p>`);
  });
});
