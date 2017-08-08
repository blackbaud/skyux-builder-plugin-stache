const search = require('./search');

describe('Search Plugin', () => {
  let config;

  beforeEach(() => {
    config = {
      skyux: {
        appSettings: {
          search: false
        }
      }
    };
  });

  it('should contain a preload hook', () => {
    expect(search.preload).toBeDefined();
  });

  it('should not alter the content', () => {
    const content = 'let foo = "bar";';
    const path = 'foo.js';
    const result = search.preload(content, path, config);
    expect(result).toBe(content);
  });

  it('should not add the search spec if search flag is false', () => {
    const content = '<stache></stache>';
    const path = 'foo.html';
    const fs = require('fs-extra');

    spyOn(fs, 'writeFileSync');
    search.preload(content, path, config);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should add the search spec to the e2e directory', () => {
    const content = '<stache></stache>';
    const path = 'foo.html';
    const fs = require('fs-extra');

    spyOn(fs, 'writeFileSync');
    config.skyux.appSettings.search = true;
    search.preload(content, path, config);

    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
