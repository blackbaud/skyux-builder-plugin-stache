const plugin = require('./json-data');
const glob = require('glob');
const fs = require('fs-extra');
const stacheJsonDataService = require('./stache-json-data.service');

describe('JSON Data Plugin', () => {
  beforeEach(() => {
    spyOn(stacheJsonDataService, 'buildStacheDataObject').and.callFake(() => {});
  });

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

  it('It should add an elvis operator to stache json attributes in html pages', () => {
    const content = new Buffer('<stache> {{ stache.jsonData.globals.productNameLong }} </stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache> {{ stache.jsonData?.globals.productNameLong }} </stache>');
  });

  it('It should replace the pageTitle attribute on the stache tag if it contains a stache data value', () => {
    spyOn(stacheJsonDataService, 'replaceWithStacheData').and.callFake(() => 'Page Title Value');
    const content = new Buffer('<stache pageTitle="{{ stache.jsonData.globals.productNameLong }}"></stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache pageTitle="Page Title Value"></stache>');
  });

  it('should attempt to build the stache json data object if one does not exist already', () => {
    spyOn(stacheJsonDataService, 'getStacheDataObject').and.callFake(() => { return undefined; });
    const content = new Buffer('');
    plugin.preload(content, 'foo.html');
    expect(stacheJsonDataService.buildStacheDataObject).toHaveBeenCalled();
  });

  it('should not try to build the stache json data object if one already exists', () => {
    spyOn(stacheJsonDataService, 'getStacheDataObject').and.callFake(() => { return true; });
    const content = new Buffer('');
    plugin.preload(content, 'foo.html');
    expect(stacheJsonDataService.buildStacheDataObject).not.toHaveBeenCalled();
  });

  it('It should replace the navTitle attribute on the stache tag if it contains a stache data value', () => {
    spyOn(stacheJsonDataService, 'replaceWithStacheData').and.callFake(() => 'Nav Title Value');
    const content = new Buffer('<stache navTitle="{{ stache.jsonData.globals.productNameLong }}"></stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache navTitle="Nav Title Value"></stache>');
  });
});
