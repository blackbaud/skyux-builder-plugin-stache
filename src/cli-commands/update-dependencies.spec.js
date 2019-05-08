/*jshint jasmine: true, node: true */
'use strict';

const fs = require('fs-extra');
const mock = require('mock-require');
const EventEmitter = require('events').EventEmitter;

let emitter;

let versionsRequested;
let logger;
let failRimraf = false;

describe('Stache Update Command', () => {

  beforeEach(() => {

    logger = jasmine.createSpyObj(
      'logger',
      [
        'info',
        'warn',
        'error',
        'verbose',
        'bobby'
      ]
    );
    mock('@blackbaud/skyux-logger', logger);

    emitter = new EventEmitter();
    mock('cross-spawn', (cmd, args) => {
      emitter.emit('spawnCalled', cmd, args);
      return emitter;
    });

    versionsRequested = {};
    mock('latest-version', (dep) => {
      versionsRequested[dep] = true;
      return Promise.resolve(`${dep}-LATEST`);
    });

    mock('rimraf', (path, opts, cb) => {
      if (failRimraf) {
        return cb('error');
      }

      return cb();
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should notify users on successful update', (done) => {
    spyOn(fs, 'readJSONSync').and.returnValue({});
    spyOn(fs, 'writeJsonSync');
    emitter.on('spawnCalled', () => {
      setImmediate(() => {
        emitter.emit('exit', 0);
      });
    });
    mock.reRequire('./update-dependencies')()
      .then(() => {
        expect(logger.info).toHaveBeenCalledWith('stache-update has successfully updated your dependences.');
        done();
      });
  });

  it('should handle errors when running npm install', (done) => {
    spyOn(fs, 'readJSONSync').and.returnValue({});
    spyOn(fs, 'writeJsonSync');
    emitter.on('spawnCalled', () => {
      setImmediate(() => {
        emitter.emit('exit', 1);
      });
    });
    mock.reRequire('./update-dependencies')()
      .then(() => {
        expect(logger.error).toHaveBeenCalledWith('npm install failed.');
        done();
      });
  });

  it('should handle errors when cleaning the template', (done) => {
    spyOn(fs, 'readJSONSync').and.returnValue({});
    spyOn(fs, 'writeJsonSync').and.callFake(() => {throw false});

    mock.reRequire('./update-dependencies')()
      .then(() => {
        expect(logger.info).toHaveBeenCalledWith('Updating package.json failed.');
        done();
      });
  });

  it('should install the latest versions of SKY UX, SKY UX Builder, and Stache', (done) => {
    spyOn(fs, 'readJSONSync').and.returnValue({
      dependencies: {},
      devDependencies: {}
    });
    let spyWriteJson = spyOn(fs, 'writeJsonSync');
    emitter.on('spawnCalled', () => {
      setImmediate(() => {
        emitter.emit('exit', 0);
      });
    });

    mock.reRequire('./update-dependencies')()
      .then(() => {
        const json = spyWriteJson.calls.mostRecent().args[1];
        const deps = {
          '@blackbaud/skyux': 'dependencies',
          '@blackbaud/stache': 'dependencies',
          '@blackbaud/skyux-builder': 'devDependencies'
        };

        Object.keys(deps).forEach(key => {
          expect(json[deps[key]][key]).toBe(`${key}-LATEST`);
          expect(versionsRequested[key]).toBe(true);
        });

        done();
      });
  });


  it('should install the latest versions of skyux-builder-plugin-auth-email-whitelist if it exists', (done) => {
    spyOn(fs, 'readJSONSync').and.returnValue({
      dependencies: {
        ['@blackbaud/skyux-builder-plugin-auth-email-whitelist']: 1
      },
      devDependencies: {}
    });
    let spyWriteJson = spyOn(fs, 'writeJsonSync');
    emitter.on('spawnCalled', () => {
      setImmediate(() => {
        emitter.emit('exit', 0);
      });
    });

    mock.reRequire('./update-dependencies')()
      .then(() => {
        const json = spyWriteJson.calls.mostRecent().args[1];
        const deps = {
          '@blackbaud/skyux': 'dependencies',
          '@blackbaud/stache': 'dependencies',
          '@blackbaud/skyux-builder': 'devDependencies',
          '@blackbaud/skyux-builder-plugin-auth-email-whitelist': 'dependencies'
        };

        Object.keys(deps).forEach(key => {
          expect(json[deps[key]][key]).toBe(`${key}-LATEST`);
          expect(versionsRequested[key]).toBe(true);
        });

        done();
      });
  });

  it('should handle errors when removing node_modules', (done) => {
    spyOn(fs, 'readJSONSync').and.returnValue({});
    spyOn(fs, 'writeJsonSync');
    failRimraf = true;

    mock.reRequire('./update-dependencies')()
      .then(() => {
        expect(logger.info).toHaveBeenCalledWith('Failed to remove node_modules.');
        done();
      });
  });
});
