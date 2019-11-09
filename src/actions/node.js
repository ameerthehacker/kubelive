'use strict';
const k8sApi = require('../kube/api');
const { baseActions, baseExecuteAction } = require('./base');

const actions = [...baseActions];

const executeAction = (key, name) => {
  if (key.name == 'd') {
    k8sApi
      .deleteNode(name)
      //TODO: show the error somewhere
      .catch(() => {});
  } else {
    baseExecuteAction(key, name);
  }
};

module.exports = {
  actions,
  executeAction
};
