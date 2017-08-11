const plugin = require('./json-data');
const glob = require('glob');
const fs = require('fs-extra');
const shared = require('./shared');
const stacheJsonDataService = require('./stache-json-data.service');

// const shared = require('./shared');


describe('JSON Data Service', () => {
  it('should handle invalid file paths', () => {
    spyOn(glob, 'sync').and.returnValue(['invalid.json']);
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    try {
      stacheJsonDataService.buildStacheDataObject();
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(plugin.preload).toThrowError(shared.StachePluginError);
    }
  });

  it('should not build a data object if no files are found', () => {
    const noFiles = [];
    spyOn(glob, 'sync').and.returnValue(noFiles);
    stacheJsonDataService.buildStacheDataObject();
    let result = stacheJsonDataService.getStacheDataObject();
    expect(result).toBe(undefined);
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

    stacheJsonDataService.buildStacheDataObject();

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
      '---TEST----.json',
      'SampleTest.json',
      'sampleFile.json',
      'sample-_-file.json'
    ];

    spyOn(glob, 'sync').and.returnValue(fileNames);
    spyOn(fs, 'readFileSync').and.returnValue('{}');

    stacheJsonDataService.buildStacheDataObject();

    let dataResult = stacheJsonDataService.getStacheDataObject();

    let results = [];
    for (let key in dataResult) {
      results.push(key);
    }

    expect(results).toContain('config');
    expect(results).toContain('file_with_spaces');
    expect(results).toContain('Testfile');
    expect(results).toContain('file_with_UPPERCASE_LETTERS');
    expect(results).toContain('file_w1th_n0mb3rs');
    expect(results).toContain('file_with_dashes');
    expect(results).toContain('file_with_underscores_____');
    expect(results).toContain('___TEST____');
    expect(results).toContain('SampleTest');
    expect(results).toContain('sampleFile');
    expect(results).toContain('sample___file');
  });

  it('should replace a string with stache data', () => {
    const fileNames = [
      'globals.json'
    ];

    spyOn(glob, 'sync').and.returnValue(fileNames);
    spyOn(fs, 'readFileSync').and.returnValue('{"test": "value"}');

    stacheJsonDataService.buildStacheDataObject();
    let result = stacheJsonDataService.replaceWithStacheData('{{ stache.jsonData.globals.test }}');
    expect(result).toBe('value');
  });
});
