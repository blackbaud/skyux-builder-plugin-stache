const runCommand = (command) => {
  switch(command) {
    case 'stache-update':
      require('./update-dependencies')();
    break;
    default:
    return false;
  }
  return true;
};

module.exports = { runCommand }
