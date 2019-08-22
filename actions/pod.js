const k8sApi = require('../kube-api');

const actions = [
  {
    key: 'd',
    description: 'Delete'
  },
  {
    key: 'l',
    description: 'Logs'
  },
  {
    key: 'c',
    description: 'Copy'
  }
];

const executeAction = async (key, name) => {
  if(key.name == 'd') {
    k8sApi.deleteNamespacedPod(name, 'kube-system');
  }
}

module.exports = {
  actions,
  executeAction
}