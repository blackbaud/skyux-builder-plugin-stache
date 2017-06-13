// const plugin = require('./json-data');
// const mock = require('mock-fs');

// describe('JSON Data Plugin', () => {
//   beforeAll(() => {
//     mock({
//       'src/stache/data': {
//         'config.json': '{ "productNameLong": "Stache 2" }',
//         'test file.json': '{ "test":"test" }'
//       },
//       'shared/json-data.service.ts': `private jsonData: any = 'noop';`
//     });
//   });

//   afterAll(() => {
//     mock.restore();
//   });

//   it('should contain a preload hook', () => {
//     expect(plugin.preload).toBeDefined();
//   });

//   it('should not alter the content if the resourcePath is not the json-data service file.', () => {
//     const content = 'let foo = "bar";';
//     const path = 'foo.js';
//     let result = plugin.preload(content, path);
//     expect(result).toBe(content);
//   });

//   it('should replace the noop string in the json-data service file with the json data.', () => {
//     const content = `private jsonData: any = 'noop';`;
//     const contentParsed = `private jsonData: any = {"config":{"productNameLong":"Stache 2"},"test-file":{"test":"test"}};`;
//     const path = 'shared/json-data.service.ts';
//     let result = plugin.preload(content, path);
//     expect(result).toContain(contentParsed);
//   });

//   it('should create a valid object key given a file name.', () => {
//     const content = `'noop'`;
//     mock({
//       'src/stache/data': {
//         'config.json': '{ }',
//         'file with spaces.json': '{ }',
//         'Tes*$^^@*(@$tfile.json': '{ }',
//         'file with UPPERCASE LETTERS.json': '{ }',
//         'file w1th n0mb3rs.json': '{ }',
//         'file-with-dashes.json': '{ }',
//         'file_with_underscores_____.json': '{ }',
//         '__proto__.json': '{ }'
//       },
//       'shared/json-data.service.ts': content
//     });
//     const path = 'src/shared/json-data.service.ts';
//     let result = plugin.preload(content, path);

//     expect(result).toContain('"config"');
//     expect(result).toContain('"file-with-spaces"');
//     expect(result).toContain('"testfile"');
//     expect(result).toContain('"file-with-uppercase-letters"');
//     expect(result).toContain('"file-w1th-n0mb3rs"');
//     expect(result).toContain('"file-with-dashes"');
//     expect(result).toContain('"file-with-underscores"');
//     expect(result).toContain('"proto"');
//   });

//   it('should handle invalid file names.', () => {
//     spyOn(console, 'error');

//     const content = `'noop'`;
//     const path = 'src/shared/json-data.service.ts';
//     const invalidFiles = {
//       '.json': '{ }',
//       '*****.json': '{ }',
//       'constructor': '{ }',
//       'prototype': '{ }',
//       'テナンス中です': '{ }'
//     };

//     mock({
//       'src/stache/data': invalidFiles
//     });

//     plugin.preload(content, path);
//     expect(console.error.calls.count()).toBe(Object.keys(invalidFiles).length);
//   });

//   it('should return the data service file unchanged if no json files exist.', () => {
//     const content = `'noop'`;
//     mock({
//       'src/stache/data': { },
//       'shared/json-data.service.ts': content
//     });
//     const path = 'src/shared/json-data.service.ts';
//     let result = plugin.preload(content, path);
//     expect(result).toBe(content);
//   });
//
//   it('should not fail if data directory doesn\'t exist');
// });
