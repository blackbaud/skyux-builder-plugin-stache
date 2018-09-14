const glob = require('glob');
const fs = require('fs-extra');
const shared = require('./utils/shared');
const jsonDataUtil = require('./utils/json-data');

describe('Route Metadata Plugin', () => {
  let plugin;
  let config;

  beforeEach(() => {
    plugin = require('./route-metadata');
    config = {
      skyux: { name: 'stache2'},
      runtime: {
        routes: [
          { routePath: 'learn' },
          { routePath: 'learn/getting-started' }
        ]
      }
    };

    spyOn(jsonDataUtil, 'parseAngularBindings').and.callFake((value) => {
      if (/stache.jsonData/.test(value)) {
        return 'Title';
      }
      return value;
    })
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache pageTitle="FAQ"></stache>`
    );
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('STACHE_ROUTE_METADATA_PROVIDERS');
  });

  it('should not change the content of other files', () => {
    const content = new Buffer('');

    let result = plugin.preload(content, 'foo.html', config);
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.js', config);
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss', config);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should abort if no routes exist in the config', () => {
    const content = new Buffer('');
    let result = plugin.preload(content, 'app-extras.module.ts', {
      runtime: { routes: [] }
    });
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'app-extras.module.ts', {
      runtime: { }
    });
    expect(result.toString()).toEqual(content.toString());
  });

  it('should abort if no html files found', () => {
    spyOn(glob, 'sync').and.returnValue([]);
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should abort if the html file does not include <stache> tags', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(`<p></p>`);
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should ignore html files that do not include `navTitle`,`pageTitle`, or `navOrder` on the <stache> tag', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(`<stache></stache>`);
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toEqual(content.toString());
  });

  it('should allow for stache json data values in pageTitle / navTitle', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache pageTitle="{{ stache.jsonData.global.title }}"></stache>`
    );
    const content = new Buffer('<stache pageTitle="{{ stache.jsonData.global.title }}"></stache>');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('"name":"Title"');
  });

  it('should prefer `navTitle` to `pageTitle`', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache pageTitle="FAQ" navTitle="Preferred"></stache>`
    );
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('"name"');
  });

  it('should only add name if `navTitle` or `pageTitle` exist', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache navOrder="8675309"></stache>`
    );
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).not.toContain('"name":"Preferred"');
    expect(result.toString()).toContain('"order":"8675309"');
  });

  fit('should set hideFromSidebar if `hideFromSidebar` attribute exists', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache pageTitle="FAQ" hideFromSidebar="true"></stache>`
    );
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('"hideFromSidebar"');
  });

  it('should add navOrder to the route if `navOrder` is provided', () => {
    spyOn(glob, 'sync').and.returnValue(['src/app/learn/index.html']);
    spyOn(fs, 'readFileSync').and.returnValue(
      `<stache navOrder="8675309"></stache>`
    );
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts', config);
    expect(result.toString()).toContain('"order":"8675309"');
  })

  it('should handle invalid file paths', () => {
    spyOn(glob, 'sync').and.returnValue(['invalid.html']);
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    const content = new Buffer('');

    try {
      plugin.preload(content, 'app-extras.module.ts', config);
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(plugin.preload).toThrowError(shared.StachePluginError);
    }
  });
});
