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

    expect(result.mock_data).toBeDefined();
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

    let globalData = jsonDataUtil.getGlobalData();
    let globalDataKeys = [];
    for (let key in globalData) {
      globalDataKeys.push(key);
    }

    expect(globalDataKeys).toContain('config');
    expect(globalDataKeys).toContain('file_with_spaces');
    expect(globalDataKeys).toContain('Testfile');
    expect(globalDataKeys).toContain('file_with_UPPERCASE_LETTERS');
    expect(globalDataKeys).toContain('file_w1th_n0mb3rs');
    expect(globalDataKeys).toContain('file_with_dashes');
    expect(globalDataKeys).toContain('file_with_underscores_____');
    expect(globalDataKeys).toContain('___TEST____');
    expect(globalDataKeys).toContain('SampleTest');
    expect(globalDataKeys).toContain('sampleFile');
    expect(globalDataKeys).toContain('sample___file');
  });

  it('should replace a string with _globalData values', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    let result = jsonDataUtil.parseAngularBindings('{{ stache.jsonData.mock_data.one }}');

    expect(result).toBe('One');
  });

  it('should traverse arrays and objects to find the _globalData value', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    let result = jsonDataUtil.parseAngularBindings('{{ stache.jsonData.mock_data.nested[2].thirdNested }}');

    expect(result).toBe('Test Target Reached');
  });

  it('should find values of stache.jsonData bindings no matter the spaces between brackets', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    let result = jsonDataUtil.parseAngularBindings('{{          stache.jsonData.mock_data.one}}');

    expect(result).toBe('One');
  });

  it('should return the original string if not an angular binding', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    let noMatchString = jsonDataUtil.parseAngularBindings('Test String');

    expect(noMatchString).toBe('Test String');
  });

  it('should return as \'undefined\' if no matching _globalData is found for a binding', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    let noMatchString = jsonDataUtil.parseAngularBindings('{{ stache.jsonData.mock_data.not_found }}');

    expect(noMatchString).toBe('undefined');
  });

  it('It should parse only @buildtime: bindings in parseAllBuildTimeBindings', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    const content = `
      {{ @buildtime:stache.jsonData.mock_data.one }}
      {{ @buildtime:stache.jsonData.mock_data.two }}
      {{ stache.jsonData.mock_data.three }}
      {{ @buildtime:stache.jsonData.mock_data.one }}
      {{ @buildtime:stache.jsonData.mock_data.not_found }}
      {{ stache.jsonData.mock_data.not_found }}`;

    const result = jsonDataUtil.parseAllBuildTimeBindings(content);

    expect(result.toString()).toEqual(`
      One
      Two
      {{ stache.jsonData.mock_data.three }}
      One
      undefined
      {{ stache.jsonData.mock_data.not_found }}`
    );
  });

  it('should parse all bindings passed to parseAngularBindings', () => {
    spyOn(glob, 'sync').and.returnValue(['mock-data.json']);
    spyOn(fs, 'readFileSync').and.returnValue(mockData);

    const bindings = `{{ stache.jsonData.mock_data.one }} {{ @buildtime:stache.jsonData.mock_data.two }}`
    let dataValue = jsonDataUtil.parseAngularBindings(bindings)

    expect(dataValue).toBe('One Two');
  });
});
