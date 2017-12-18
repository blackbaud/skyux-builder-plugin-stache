const fs = require('fs-extra');
const githubMock = require('./fixtures/github-repo-data.json');
const plugin = require('./repo-url');
const StacheError = require('./utils/shared').StachePluginError;
const vstsMock = require('./fixtures/vsts-repo-data.json');

describe('Repo Url Plugin', () => {
  const content = new Buffer('');
  let fileContents;
  let filePath;

  beforeEach(() => {
    fileContents = undefined;
    filePath = undefined;
    spyOn(fs, 'readJsonSync').and.returnValue(vstsMock);
    spyOn(fs, 'writeFileSync').and.callFake(function (path, contents) {
      fileContents = contents;
      filePath = path;
    });
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should write the repo.json file to the stache data directory', () => {
    plugin.preload(content, 'app-extras.module.ts');
    expect(fileContents).toEqual(JSON.stringify({
      url: 'https://blackbaud.visualstudio.com/Products/_git/skyux-spa-stache-test-pipeline?path=%2Fsrc%2Fapp',
      vstsBranchSelector: '&version=GBmaster'
    }));
    expect(filePath).toEqual(process.cwd() + '/src/stache/data/repo.json');
  });

  it('should format the url for github', () => {
    fs.readJsonSync = jasmine.createSpy().and.returnValue(githubMock);
    plugin.preload(content, 'app-extras.module.ts');
    expect(fileContents).toEqual(JSON.stringify({
      url: 'https://github.com/blackbaud/stache-search/tree/master/src/app'
    }));
  });

  it('should strip out the .git from the end of urls if it exists', () => {
    fs.readJsonSync = jasmine.createSpy().and.returnValue(githubMock);
    plugin.preload(content, 'app-extras.module.ts');

    expect(JSON.parse(fileContents).url.endsWith('.git')).toBe(false);
  });

  it('should not change the content of files', () => {
    let result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.js');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'app-extras.module.ts');
    expect(result.toString()).toEqual(content.toString());
  });

  it('should throw an error if the repository object is undefined', () => {
    fs.readJsonSync = jasmine.createSpy().and.returnValue({});
    let test = function () {
      return plugin.preload(content, 'app-extras.module.ts');
    }

    expect(test).toThrowError('Package.json must have a repository object and url key to use edit button feature.');
  });

  it('should handle errors with reading the json file', () => {
    fs.readJsonSync = jasmine.createSpy().and.callFake(() => {
      throw new Error('Cannot read file');
    });

    let test = function () {
      return plugin.preload(content, 'app-extras.module.ts');
    }

    expect(test).toThrowError(StacheError);
  });

  it('should handle errors with writing the json file', () => {
    fs.writeFileSync = jasmine.createSpy().and.callFake(() => {
      throw new Error('Cannot write file');
    });

    let test = function () {
      return plugin.preload(content, 'app-extras.module.ts');
    }

    expect(test).toThrowError(StacheError);
  });
});
