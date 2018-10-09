const mock = require('mock-require');
const publicApi = require('./public-api');

describe('Public API', () => {

  const cliCommands = {
    runCommand: jasmine.createSpy('runCommand').and.callFake(() => {})
  };

  const mockEntryPlugin = function() {
    return {
      preload: jasmine.createSpy('preload').and.callFake(() => {})
    }
  }

  beforeEach(() => {
    mock('./src/entry', mockEntryPlugin);
    mock('./src/cli-commands/cli-commands', cliCommands);
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should expose a preload method to the publicApi', () => {
    expect(publicApi.preload).toBeDefined();
  });

  it('should expose a runCommand method to the publicApi', () => {
    expect(publicApi.runCommand).toBeDefined();
  });

});
