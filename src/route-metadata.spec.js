const glob = require('glob');
const fs = require('fs-extra');
const shared = require('./shared');

describe('Route Metadata Plugin', () => {
  let plugin;
  let config;

  beforeEach(() => {
    plugin = require('./route-metadata');
    config = {
      runtime: {
        routes: [
          { routePath: 'learn' },
          { routePath: 'learn/getting-started' }
        ]
      }
    };
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache pageTitle="FAQ"></stache>`
    );
    const result = plugin.preload('', 'app-extras.module.ts', config);
    expect(result).toContain('STACHE_ROUTE_METADATA_PROVIDERS');
  });

  it('should not change the content of other files', () => {
    let result = plugin.preload('', 'foo.html', config);
    expect(result).toBe('');

    result = plugin.preload('', 'foo.js', config);
    expect(result).toBe('');

    result = plugin.preload('', 'foo.scss', config);
    expect(result).toBe('');
  });

  it('should abort if no routes exist in the config', () => {
    let result = plugin.preload('', 'app-extras.module.ts', {
      runtime: { routes: [] }
    });
    expect(result).toBe('');

    result = plugin.preload('', 'app-extras.module.ts', {
      runtime: { }
    });
    expect(result).toBe('');
  });

  it('should abort if no html files found', () => {
    spyOn(glob, 'sync').and.returnValue([]);
    const result = plugin.preload('', 'app-extras.module.ts', config);
    expect(result).toBe('');
  });

  it('should abort if the html file does not include <stache> tags', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(`<p></p>`);
    const result = plugin.preload('', 'app-extras.module.ts', config);
    expect(result).toBe('');
  });

  it('should ignore html files that do not include `navTitle` or `pageTitle` on the <stache> tag', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(`<stache></stache>`);
    const result = plugin.preload('', 'app-extras.module.ts', config);
    expect(result).toBe('');
  });

  it('should prefer `navTitle` to `pageTitle`', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache pageTitle="FAQ" navTitle="Preferred"></stache>`
    );
    const result = plugin.preload('', 'app-extras.module.ts', config);
    expect(result).toContain('"name":"Preferred"');
  });

  it('should handle invalid file paths', () => {
    spyOn(glob, 'sync').and.returnValue(['invalid.html']);
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    try {
      plugin.preload('', 'app-extras.module.ts', config);
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(plugin.preload).toThrowError(shared.StachePluginError);
    }
  });
});
