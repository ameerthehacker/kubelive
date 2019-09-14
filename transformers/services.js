'use strict';
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

/**
 * It transforms the items object from kube api into a custom format
 * @param {Array<V1Endpoint>} items list of V1Endpoint object from the kube service api
 * @returns List of custom formatted endpoint data
 */
const transformServiceData = (items) => {
  const services = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const ports = [];
    let externalIp = item.spec.externalIp;

    if (item.spec.type == 'LoadBalancer' && !externalIp) {
      externalIp = '<pending>';
    } else {
      externalIp = '<none>';
    }

    item.spec.ports.forEach((port) => {
      let portDescription;

      if (!port.nodePort) {
        portDescription = port.port;
      } else {
        portDescription = `${port.port}:${port.nodePort}`;
      }

      portDescription += `/${port.protocol}`;

      ports.push(portDescription);
    });

    services.push({
      name: { text: item.metadata.name, isSelector: true },
      type: { text: item.spec.type },
      'cluster-ip': { text: item.spec.clusterIP },
      ports: { text: ports.join(',') },
      'external-ip': { text: externalIp },
      age: {
        text: timeAgo.format(item.metadata.creationTimestamp, {
          flavour: 'tiny'
        })
      }
    });
  }

  return services;
};

module.exports = {
  transformServiceData
};
