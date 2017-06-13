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
