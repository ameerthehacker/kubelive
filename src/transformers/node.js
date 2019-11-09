'use strict';
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

/**
 * It transforms the items object from kube api into a custom format
 * @param {Array<V1Node} items list of V1Node object from the kube nodes api
 * @returns List of custom formatted node data
 */
const transformNodeData = (items) => {
  const nodes = [];
  const nodeRoleLabel = 'node-role.kubernetes.io/';

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let itemStatus = item.status.conditions[
      item.status.conditions.length - 1
    ].type.toUpperCase();
    let itemRoles = [];

    Object.keys(item.metadata.labels).forEach((label) => {
      if (label.startsWith(nodeRoleLabel)) {
        itemRoles.push(label.replace(nodeRoleLabel, ''));
      }
    });

    if (itemRoles.length == 0) {
      itemRoles.push('<none>');
    }

    nodes.push({
      name: { text: item.metadata.name, isSelector: true },
      version: { text: item.status.nodeInfo.kubeletVersion },
      status: { text: itemStatus },
      role: { text: itemRoles.join(',') },
      age: {
        text: timeAgo.format(item.metadata.creationTimestamp, {
          flavour: 'tiny'
        })
      }
    });
  }

  return nodes;
};

module.exports = {
  transformNodeData
};
