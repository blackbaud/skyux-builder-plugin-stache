const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const shared = require('./shared');
const mock = require('mock-require');

const mockData = fs.readFileSync(path.resolve(__dirname, '../fixtures/mock-data.json'));

describe('JSON Data Util', () => {
  let jsonDataUtil;

  beforeEach(() => {
    jsonDataUtil = mock.reRequire('./json-data');
  });

  it('should create a _globalData object from json data', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
    const result = jsonDataUtil.getGlobalData();
    expect(result).toBeDefined();
  });

  it('should set the _globalData to undefined if no file paths are found', () => {
    spyOn(glob, 'sync').and.returnValue([]);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
    const result = jsonDataUtil.getGlobalData();
    expect(result).not.toBeDefined();
  });

  it('should throw an error for invalid file paths', () => {
    spyOn(glob, 'sync').and.returnValue(['invalid.json']);
    spyOn(fs, 'readFileSync').and.throwError('Invalid file.');

    try {
      jsonDataUtil.getGlobalData();
    } catch (error) {
      expect(fs.readFileSync).toThrowError('Invalid file.');
      expect(jsonDataUtil.getGlobalData).toThrowError(shared.StachePluginError);
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
    jsonDataUtil.getGlobalData();
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

    let dataResult = jsonDataUtil.getGlobalData();
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

  it('should replace a string with _globalData values', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    jsonDataUtil.getGlobalData();
    let result = jsonDataUtil.parseAngularBinding('{{ stache.jsonData.mock_data.one }}');
    expect(result).toBe('One');
  });

  it('should traverse arrays and objects to find the _globalData value', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
    let result = jsonDataUtil.parseAngularBinding('{{ stache.jsonData.mock_data.nested[2].thirdNested }}');
    expect(result).toBe('Test Target Reached');
  });

  it('should find values of stache.jsonData bindings no matter the spaces between brackets', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
    let result = jsonDataUtil.parseAngularBinding('{{          stache.jsonData.mock_data.one}}');
    expect(result).toBe('One');
  });

  it('should return the original string if no _globalData value is found', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);
    let noMatchString = jsonDataUtil.parseAngularBinding('Test String');
    let noKeyFound = jsonDataUtil.parseAngularBinding('{{ stache.jsonData.mock_data.notFound }}')
    expect(noMatchString).toBe('Test String');
    expect(noKeyFound).toBe('{{ stache.jsonData.mock_data.notFound }}');
  });
});
