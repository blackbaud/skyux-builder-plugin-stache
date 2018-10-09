const StacheEntryPlugin = require('./plugins/entry');
const cliCommands = require('./cli-commands/cli-commands');
const entryPlugin = new StacheEntryPlugin();

const publicApi = {};
publicApi.preload = entryPlugin.preload;
publicApi.runCommand = cliCommands.runCommand;

module.exports = publicApi;
