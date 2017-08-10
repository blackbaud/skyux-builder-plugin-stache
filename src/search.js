const fs = require('fs-extra');
const path = require('path');
const shared = require('./shared');

const preload = (content, resourcePath, skyPagesConfig) => {
  if (!skyPagesConfig.skyux.appSettings.search) {
    return content;
  }

  const template = `// Use browser to access other sites (that are running angular)
import { browser, element, by } from 'protractor';

// Use SkyHostBrowser to access your locally served SPA
import { SkyHostBrowser } from '@blackbaud/skyux-builder/runtime/testing/e2e';

const fs = require('fs');
const path = require('path');

const walkSync = (dir, filePaths: string[] = []) => {
  let files = fs.readdirSync(dir);
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filePaths = walkSync(path.join(dir, file), filePaths);
    } else {
      if (file.includes('index.html')) {
        filePaths.push(path.join(dir, file));
      }
    }
  });
  return filePaths;
};

describe('Search Results', () => {
  let files;

  function removeUnnecessaryElements() {
    Array.from(
      document.querySelectorAll(
        '.stache-sidebar, .stache-breadcrumbs, .stache-table-of-contents'
      )
    ).forEach(el => el.remove());
  }

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
    // Temporary solution until we can get access to the actual route array
    files = walkSync(path.join(__dirname, '..', 'src', 'app'));
    files = files.map(file => {
      let route = file.split('/app')[1];
      route = route.slice(0, route.length - 11);
      if (route === '') {
        route = '/';
      }
      return route;
    });
  });

  it('should generate search results', (done) => {
    let config = JSON.parse(browser.params.skyPagesConfig);
    let appName = config.skyux.name;
    let url = config.skyux.host.url;
    let content = {
      name: appName,
      url: url
    };

    function scrapePageContent(file: string) {
      let pageContent = {
        path: file
      };
      return SkyHostBrowser
        .get(file)
        .then(() => {
          return browser.executeScript(removeUnnecessaryElements);
        })
        .then(() => {
            return element(by.css('.stache-wrapper')).getText();
        })
        .then(text => {
          pageContent['text'] = text;
          return element(by.css('.stache-page-title')).getText();
        })
        .then(text => {
          pageContent['title'] = text;
          return pageContent;
        })
        .catch(error => {
          if (error.name === 'NoSuchElementError') {
            console.log('Must have the <stache> tag and a pageTitle on page to scrape content.');
            return pageContent;
          } else {
            throw new Error(error);
          }
        });
    }

    Promise.all(files.map(file => {
      return scrapePageContent(file);
    }))
      .then((pageContents) => {
        content['content'] = pageContents;
        return new Promise((resolve, reject) => {
          fs.writeFile(
            path.join(
              __dirname,
              '..',
              'src',
              'stache',
              'search',
              'search.json'
            ),
            JSON.stringify(content),
            (err) => {
              err ? reject(err) : resolve();
            }
          );
        });
      })
      .then(() => {
        done();
      })
      .catch(error => {
        console.log('ERROR', error);
        expect(error).toBeNull();
        done();
      });
  });
});
`
  function addSearchSpecToProject() {
    try {
      if (fs.existsSync(path.join('e2e', 'stache-search.e2e-spec.ts'))) {
        return;
      }
      fs.writeFileSync(path.join('e2e', 'stache-search.e2e-spec.ts'), template);
    } catch (error) {
      throw new shared.StachePluginError(error.message);
    }
  }

  addSearchSpecToProject();

  return content;
};

module.exports = { preload };
