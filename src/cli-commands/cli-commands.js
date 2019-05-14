const runCommand = (command) => {
  switch(command) {
    case 'stache-update':
      require('./update-dependencies')();
    break;
    case 'stache-migrate':
      require('./migrate-components')();
    break;
    default:
    return false;
  }
  return true;
};

module.exports = { runCommand }
