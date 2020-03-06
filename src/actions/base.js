'use strict';
const clipboardy = require('clipboardy');

const baseActions = [
  {
    key: 'd',
    description: 'Delete',
    needsConfirmation: true
  },
  {
    key: 'c',
    description: 'Copy'
  },
  {
    key: 'q',
    description: 'Quit'
  }
];

const baseExecuteAction = (key, name) => {
  if (key.name == 'c') {
    clipboardy.writeSync(name);
  } else if (key.name == 'q') {
    // exit the program without any fuss
    process.exit(0);
  }
};

module.exports = {
  baseActions,
  baseExecuteAction
};
