// describe('Route Metadata Plugin > Collector', () => {
//   let plugin;
//   let config;

//   beforeEach(() => {
//     plugin = require('./collector');

//     config = {
//       runtime: {
//         routes: [
//           {
//             routePath: 'learn'
//           },
//           {
//             routePath: 'learn/getting-started'
//           }
//         ]
//       }
//     };
//   });

//   afterEach(() => {
//     plugin.routes = [];
//     delete require.cache[require.resolve('./collector')]
//   });

//   it('should contain a preload hook', () => {
//     expect(plugin.preload).toBeDefined();
//   });

//   it('should never affect the file\'s content', () => {
//     const content = '<stache pageTitle="My Page"></stache>';
//     const path = '/src/app/learn/index.html';
//     let result = plugin.preload(content, path, config);
//     expect(result).toBe(content);
//   });

//   it('should ignore non-HTML files', () => {
//     const content = '{}';
//     const path = '/src/app/foo.json';
//     plugin.preload(content, path, config);
//     expect(plugin.routes.length).toBe(0);
//   });

//   it('should ignore HTML files that do not have `<stache>` tags', () => {
//     const content = '<h1></h1>';
//     const path = '/src/app/learn/index.html';
//     plugin.preload(content, path, config);
//     expect(plugin.routes.length).toBe(0);
//   });

//   it('should save a route\'s preferred name if `pageTitle` is set', () => {
//     const content = '<stache pageTitle="My Page"></stache>';
//     const path = '/src/app/learn/index.html';
//     plugin.preload(content, path, config);
//     expect(plugin.routes[0].name).toBe('My Page');
//   });

//   it('should save a route\'s preferred name if `navTitle` is set', () => {
//     const content = '<stache pageTitle="My Long Page Title" navTitle="Short Title"></stache>';
//     const path = '/src/app/learn/index.html';
//     plugin.preload(content, path, config);
//     expect(plugin.routes[0].name).toBe('Short Title');
//   });

//   it('should ignore files that do not set `pageTitle`', () => {
//     const content = '<stache></stache>';
//     const path = '/src/app/learn/index.html';
//     plugin.preload(content, path, config);
//     expect(plugin.routes.length).toBe(0);
//   });

//   it('should not affect files if routes are not defined', () => {
//     const content = '<stache pageTitle="My Page"></stache>';
//     const path = '/src/app/learn/index.html';
//     let result = plugin.preload(content, path, { runtime: { } });
//     expect(result).toBe(content);
//   });
// });

// const mock = require('mock-require');

// describe('Route Metadata Plugin > Generator', () => {
//   let plugin;

//   beforeEach(() => {
//     mock('./collector', {
//       preload: () => {},
//       routes: [
//         {
//           name: 'Sample',
//           path: '/'
//         }
//       ]
//     });

//     plugin = require('./generator');
//   });

//   afterEach(() => {
//     mock.stop('./collector');
//   });

//   it('should contain a preload hook', () => {
//     expect(plugin.preload).toBeDefined();
//   });

//   it('should only change the content of the route-metadata.service.ts file', () => {
//     const content = '<p></p>';
//     const path = 'sample.service.ts';
//     const result = plugin.preload(content, path);
//     expect(result).toBe(content);
//   });

//   it('should generate the contents of the route-metadata.service.ts file', () => {
//     const content = '';
//     const path = 'src/app/public/src/modules/shared/route-metadata.service.ts';
//     const result = plugin.preload(content, path);
//     expect(result).toContain('export class StacheRouteMetadataService {');
//   });

//   it('should add the routes from Collector to the route-metadata.service.ts file', () => {
//     const content = '';
//     const path = 'src/app/public/src/modules/shared/route-metadata.service.ts';
//     const result = plugin.preload(content, path);
//     expect(result).toContain('public routes: any[] = [{"name":"Sample","path":"/"}];');
//   });

//   it('should handle an invalid routes array', () => {
//     mock('./collector', {
//       preload: () => {},
//       routes: undefined
//     });

//     plugin = mock.reRequire('./generator');

//     const content = '';
//     const path = 'src/app/public/src/modules/shared/route-metadata.service.ts';
//     const result = plugin.preload(content, path);
//     expect(result).toContain('public routes: any[] = [];');
//   });
// });
