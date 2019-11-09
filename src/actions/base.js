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
  }
];

const baseExecuteAction = (key, name) => {
  if (key.name == 'c') {
    clipboardy.writeSync(name);
  }
};

module.exports = {
  baseActions,
  baseExecuteAction
};
