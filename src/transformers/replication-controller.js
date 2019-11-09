'use strict';
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

/**
 * It transforms the items object from kube api into a custom format
 * @param {Array<V1ReplicationController} items list of V1ReplicationController object from the kube replication controller api
 * @returns List of custom formatted replication controller data
 */
const transformReplicationControllerData = (items) => {
  const replicationControllers = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    replicationControllers.push({
      name: { text: item.metadata.name, isSelector: true },
      desired: { text: item.spec.replicas },
      current: { text: item.status.availableReplicas },
      ready: { text: item.status.readyReplicas },
      age: {
        text: timeAgo.format(item.metadata.creationTimestamp, {
          flavour: 'tiny'
        })
      }
    });
  }

  return replicationControllers;
};

module.exports = {
  transformReplicationControllerData
};
