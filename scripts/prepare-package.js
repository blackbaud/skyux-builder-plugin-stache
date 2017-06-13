/* jshint node: true */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const rootPath = path.join(__dirname, '..');
const distPath = path.join(rootPath, 'dist');

function createDist() {
  return new Promise((resolve, reject) => {
    rimraf(distPath, {}, () => {
      mkdirp(path.join(distPath, 'src'), (err) => {
        if (err) {
          reject(err);
          return;
        }

        fs.copySync(
          path.join(rootPath, 'src'),
          path.join(distPath, 'src'),
          {
            filter: (src) => {
              const isSpecFile = (src.match(/\.spec\.js$/));
              const isHelpersDir = (src.match(/helpers/));
              return (!isSpecFile && !isHelpersDir);
            }
          }
        );
        resolve();
      });
    });
  });
}

function makePackageFileForDist() {
  const packageJson = fs.readJSONSync(path.join(rootPath, 'package.json'));
  packageJson.module = 'index.js';
  fs.writeJSONSync(
    path.join(distPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
}

function copyFilesToDist() {
  fs.copySync(path.join(rootPath, 'index.js'), path.join(distPath, 'index.js'));
  fs.copySync(path.join(rootPath, 'README.md'), path.join(distPath, 'README.md'));
  fs.copySync(path.join(rootPath, 'CHANGELOG.md'), path.join(distPath, 'CHANGELOG.md'));
}

createDist()
  .then(() => {
    makePackageFileForDist();
    copyFilesToDist();
  });
