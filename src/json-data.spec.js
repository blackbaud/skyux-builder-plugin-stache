const plugin = require('./json-data');
const glob = require('glob');
const fs = require('fs-extra');
// const shared = require('./shared');

describe('JSON Data Plugin', () => {

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should add providers to the app-extras.module.ts file', () => {
    spyOn(glob, 'sync').and.returnValue(['foo.json']);
    spyOn(fs, 'readFileSync').and.returnValue('{}');
    const content = new Buffer('');
    const result = plugin.preload(content, 'app-extras.module.ts');
    expect(result.toString()).toContain('STACHE_JSON_DATA_PROVIDERS');
  });

  it('should add elvis operators to html files', () => {
    const content = new Buffer('{{stache.jsonData.global}}');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('{{stache.jsonData?.global}}');
  });

  it('should not change the content of other files', () => {
    const content = new Buffer('');

    let result = plugin.preload(content, 'foo.js');
    expect(result.toString()).toEqual(content.toString());

    result = plugin.preload(content, 'foo.scss');
    expect(result.toString()).toEqual(content.toString());
  });

  // it('should abort if json files are nonexistant', () => {
  //   spyOn(glob, 'sync').and.returnValue([]);
  //   const content = new Buffer('');
  //   const result = plugin.preload(content, 'app-extras.module.ts');
  //   expect(result.toString()).toEqual(content.toString());
  // });

  // it('should handle invalid file paths', () => {
  //   spyOn(glob, 'sync').and.returnValue(['invalid.json']);
  //   spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

  //   const content = new Buffer('');

  //   try {
  //     plugin.preload(content, 'app-extras.module.ts');
  //   } catch (error) {
  //     expect(fs.readFileSync).toThrowError('Invalid file.');
  //     expect(plugin.preload).toThrowError(shared.StachePluginError);
  //   }
  // });

  // it('should log errors for invalid file names', () => {
  //   const invalidFiles = [
  //     '.json',
  //     '*****.json',
  //     'constructor.json',
  //     'prototype.json',
  //     'テナンス中です.json'
  //   ];

  //   spyOn(glob, 'sync').and.returnValue(invalidFiles);
  //   spyOn(console, 'error').and.returnValue('');

  //   const content = new Buffer('');
  //   plugin.preload(content, 'app-extras.module.ts');

  //   expect(console.error.calls.count()).toBe(invalidFiles.length);
  // });

  // it('should create a valid object key given a file name.', () => {
  //   const fileNames = [
  //     'config.json',
  //     'file with spaces.json',
  //     'Tes*$^^@*(@$tfile.json',
  //     'file with UPPERCASE LETTERS.json',
  //     'file w1th n0mb3rs.json',
  //     'file-with-dashes.json',
  //     'file_with_underscores_____.json',
  //     '---TEST----.json',
  //     'SampleTest.json',
  //     'sampleFile.json',
  //     'sample-_-file.json'
  //   ];

  //   spyOn(glob, 'sync').and.returnValue(fileNames);
  //   spyOn(fs, 'readFileSync').and.returnValue('{}');

  //   const content = new Buffer('');
  //   const result = plugin.preload(content, 'app-extras.module.ts');

  //   expect(result).toContain('"config":{');
  //   expect(result).toContain('"file_with_spaces":{');
  //   expect(result).toContain('"Testfile":{');
  //   expect(result).toContain('"file_with_UPPERCASE_LETTERS":{');
  //   expect(result).toContain('"file_w1th_n0mb3rs":{');
  //   expect(result).toContain('"file_with_dashes":{');
  //   expect(result).toContain('"file_with_underscores_____":{');
  //   expect(result).toContain('"___TEST____":{');
  //   expect(result).toContain('"SampleTest":{');
  //   expect(result).toContain('"sampleFile":{');
  //   expect(result).toContain('"sample___file":{');
  // });
});
