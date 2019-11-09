'use strict';
const k8sApi = require('../kube/api');
const { baseActions, baseExecuteAction } = require('./base');

const actions = [...baseActions];

const executeAction = (key, name, namespace) => {
  if (key.name == 'd') {
    k8sApi
      .deleteNamespacedReplicationController(name, namespace)
      //TODO: show the error somewhere
      .catch(() => {});
  } else {
    baseExecuteAction(key, name, namespace);
  }
};

module.exports = {
  actions,
  executeAction
};
