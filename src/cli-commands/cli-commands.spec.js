
const mock = require('mock-require');
const mockCliCommands = require('./cli-commands');
describe('Cli Commands', () => {

  const mockUpdate = jasmine.createSpy().and.returnValue(() => {});

  beforeEach(() => {
    mock('./update-dependencies', mockUpdate);
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should run the update command when runCommand is called with \'update-dependencies\'', () => {
    let response = mockCliCommands.runCommand('stache-update', 'args');
    expect(mockUpdate).toHaveBeenCalled();
    expect(response).toBe(true);
  });

  it('should return false if the command is not recognized by runCommand', () => {
    let response = mockCliCommands.runCommand('unknown-command', 'args');
    expect(response).toBe(false);
  });
});
