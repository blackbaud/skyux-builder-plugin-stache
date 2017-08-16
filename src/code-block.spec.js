const mock = require('mock-require');

describe('Code Block Plugin', () => {
  let plugin;
  beforeAll(() => {
    mock('./utils/json-data', {
      parseAllBuildTimeBindings(content) {
        return content.toString().replace(/{{ @buildTime:stache.jsonData.codeBlock.test }}/g, 'Test');
      }
    });
  });

  beforeEach(() => {
    plugin = mock.reRequire('./code-block');
  })

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = new Buffer('let foo = "bar";');
    const path = 'foo.js';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should alter the content if the html file does not include any <stache-code-block> tags.', () => {
    const content = new Buffer('<p></p>');
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should convert the inner HTML of all <stache-code-block> to HTML entities.', () => {
    const content = new Buffer(`
      <stache-code-block>
        <p>My content</p>
        {{ myVar }}
        $(document).ready();
      </stache-code-block>
      <stache-code-block></stache-code-block>
    `);
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toContain('&lt;p>My content&lt;/p>');
    expect(result.toString()).toContain('{{ \'{\' }}{{ \'{\' }} myVar }}');
  });

  it('should convert should convert only @buildTime angular bindings.', () => {
    const content = new Buffer(`
      <stache-code-block>
        {{ stache.jsonData.codeBlock.test }} {{ @buildTime:stache.jsonData.codeBlock.test }}
      </stache-code-block>
    `);
    const path = 'foo.html';
    const result = plugin.preload(content, path);
    expect(result.toString()).toContain(`{{ '{' }}{{ '{' }} stache.jsonData.codeBlock.test }} Test`);
  });
});
