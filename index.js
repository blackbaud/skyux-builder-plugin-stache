const StacheEntryPlugin = require('./src/entry');
const cliCommands = require('./src/cli-commands/cli-commands');
const entryPlugin = new StacheEntryPlugin();

const publicApi = {};
publicApi.preload = entryPlugin.preload;
publicApi.runCommand = cliCommands.runCommand;
module.exports = publicApi;
