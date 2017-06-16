const plugin = require('./json-data');
const glob = require('glob');
const fs = require('fs-extra');
const shared = require('./shared');

describe('JSON Data Plugin', () => {

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    spyOn(glob, 'sync').and.returnValue(['foo.json']);
    spyOn(fs, 'readFileSync').and.returnValue('{}');
    const result = plugin.preload('', 'app-extras.module.ts');
    expect(result).toContain('STACHE_JSON_DATA_PROVIDERS');
  });

  it('should add elvis operators to html files', () => {
    const result = plugin.preload('{{stache.jsonData.global}}', 'foo.html');
    expect(result).toEqual('{{stache.jsonData?.global}}');
  });

  it('should not change the content of other files', () => {
    let result = plugin.preload('', 'foo.js');
    expect(result).toBe('');

    result = plugin.preload('', 'foo.scss');
    expect(result).toBe('');
  });

  it('should abort if json files are nonexistant', () => {
    spyOn(glob, 'sync').and.returnValue([]);
    const result = plugin.preload('', 'app-extras.module.ts');
    expect(result).toBe('');
  });

  it('should handle invalid file paths', () => {
    spyOn(glob, 'sync').and.returnValue(['invalid.json']);
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    try {
      plugin.preload('', 'app-extras.module.ts');
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(plugin.preload).toThrowError(shared.StachePluginError);
    }
  });

  it('should log errors for invalid file names', () => {
    const invalidFiles = [
      '.json',
      '*****.json',
      'constructor.json',
      'prototype.json',
      'テナンス中です.json'
    ];

    spyOn(glob, 'sync').and.returnValue(invalidFiles);
    spyOn(console, 'error').and.returnValue('');

    plugin.preload('', 'app-extras.module.ts');

    expect(console.error.calls.count()).toBe(invalidFiles.length);
  });

  it('should create a valid object key given a file name.', () => {
    const fileNames = [
      'config.json',
      'file with spaces.json',
      'Tes*$^^@*(@$tfile.json',
      'file with UPPERCASE LETTERS.json',
      'file w1th n0mb3rs.json',
      'file-with-dashes.json',
      'file_with_underscores_____.json',
      '__proto__.json',
      '---TEST----.json',
      'SampleTest.json',
      'sampleFile.json',
      'sample-_-file.json'
    ];

    spyOn(glob, 'sync').and.returnValue(fileNames);
    spyOn(fs, 'readFileSync').and.returnValue('{}');

    const result = plugin.preload('', 'app-extras.module.ts');

    expect(result).toContain('"config":{');
    expect(result).toContain('"file_with_spaces":{');
    expect(result).toContain('"testfile":{');
    expect(result).toContain('"file_with_UPPERCASE_LETTERS":{');
    expect(result).toContain('"file_w1th_n0mb3rs":{');
    expect(result).toContain('"file_with_dashes":{');
    expect(result).toContain('"file_with_underscores":{');
    expect(result).toContain('"proto":{');
    expect(result).toContain('"TEST:{');
    expect(result).toContain('"SampleFile:{');
    expect(result).toContain('"sampleFile:{');
    expect(result).toContain('"sample___file":{');
  });
});
