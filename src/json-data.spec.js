const plugin = require('./json-data');
const glob = require('glob');
const fs = require('fs-extra');
const stacheJsonDataService = require('./services/stache-json-data.service');

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
    stacheJsonDataService.setStacheDataObject({
      globals: {
        testPageTitle : 'Page Title Value'
      }
    });
    const content = new Buffer('<stache pageTitle="{{ stache.jsonData.globals.testPageTitle }}"></stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache pageTitle="Page Title Value"></stache>');
  });

  it('It should replace the navTitle attribute on the stache tag if it contains a stache data value', () => {
    stacheJsonDataService.setStacheDataObject({
      globals: {
        testNavTitle: 'Nav Title Value'
      }
    });
    const content = new Buffer('<stache navTitle="{{ stache.jsonData.globals.testNavTitle }}"></stache>');
    const result = plugin.preload(content, 'foo.html');
    expect(result.toString()).toEqual('<stache navTitle="Nav Title Value"></stache>');
  });
});
