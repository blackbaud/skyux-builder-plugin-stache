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

  it('should not alter the content if the html file does not include any <stache-markdown> tags.', () => {
    const content = new Buffer('<p></p>');
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should respect and render html inside markdown component', () => {
    const content = new Buffer(`
<stache-markdown>
<ul>
  <li>
    item
  </li>
</ul>
</stache-markdown>
`);
    const path = 'foo.html';
    const result = plugin.preload(content, path).toString();
    expect(result).toContain(`
<stache-markdown><ul>
  <li>
    item
  </li>
</ul>
</stache-markdown>`);
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

  it('should handle separate renderings for different header levels', () => {
    const content = new Buffer(`
<stache-markdown>
# Title Heading

## Page Anchor Heading

### H3 Heading

#### H4 Heading
</stache-markdown>
`);

    const path = 'foo.html';
    const result = plugin.preload(content, path).toString();

    expect(result).toContain(`
<h1>
  Title Heading
</h1>

<stache-page-anchor>
  Page Anchor Heading
</stache-page-anchor>

<h3>
  H3 Heading
</h3>

<h4>
  H4 Heading
</h4>
`);
  });

  it('should use a custom renderer for headings, code-blocks, code', () => {
    const content = new Buffer(`
<stache-markdown>
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
    expect(result).toContain(`
<stache-page-anchor>
  Heading 2
</stache-page-anchor>`);

    expect(result).toContain(
`<sky-code-block languageType="js">
JS-code
</sky-code-block>
`);

    expect(result).toContain(`<p>This is an <stache-code>inline</stache-code> code example.</p>`);
  });
});
