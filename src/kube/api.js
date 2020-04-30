'use strict';
const k8s = require('@kubernetes/client-node');
const { getCurrentCXT } = require('../utils/utils');
const chalk = require('chalk').default;

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const currentCXT = getCurrentCXT();

if (currentCXT) {
  kc.setCurrentContext(currentCXT);
}

try {
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  module.exports = k8sApi;
} catch (err) {
  console.log(chalk.red(err));
  process.exit(1);
}
