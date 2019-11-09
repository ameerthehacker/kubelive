'use strict';
const {
  transformReplicationControllerData
} = require('../../src/transformers/replication-controller');

const buildReplicationControllerItems = (options) => {
  const item = {
    metadata: {
      name: options.name || 'some-replication-controller-name',
      creationTimestamp: options.creationTimestamp || Date.now()
    },
    spec: {
      replicas: options.replicas || 1
    },
    status: {
      availableReplicas: options.availableReplicas || 1,
      readyReplicas: options.readyReplicas || 1
    }
  };

  return [item];
};

describe('transformReplicationControllerData()', () => {
  it('should set the replica controller name correctly', () => {
    const replicaControllerName = 'some-replica-name';
    const items = buildReplicationControllerItems({
      name: replicaControllerName
    });

    const replicaController = transformReplicationControllerData(items)[0];

    expect(replicaController.name.text).toEqual(replicaControllerName);
  });

  it('should set the replica controller name as selector', () => {
    const replicaControllerName = 'some-replica-name';
    const items = buildReplicationControllerItems({
      name: replicaControllerName
    });

    const replicaController = transformReplicationControllerData(items)[0];

    expect(replicaController.name.isSelector).toBeTruthy();
  });

  it('should set the desired count correctly', () => {
    const desiredCount = 2;
    const items = buildReplicationControllerItems({
      replicas: desiredCount
    });

    const replicaController = transformReplicationControllerData(items)[0];

    expect(replicaController.desired.text).toEqual(desiredCount);
  });

  it('should set the current count correctly', () => {
    const currentCount = 2;
    const items = buildReplicationControllerItems({
      availableReplicas: currentCount
    });

    const replicaController = transformReplicationControllerData(items)[0];

    expect(replicaController.current.text).toEqual(currentCount);
  });

  it('should set the ready count correctly', () => {
    const readyCount = 2;
    const items = buildReplicationControllerItems({
      readyReplicas: readyCount
    });

    const replicaController = transformReplicationControllerData(items)[0];

    expect(replicaController.ready.text).toEqual(readyCount);
  });

  it('should set the time ago correctly', () => {
    const items = buildReplicationControllerItems({
      creationTimestamp: Date.now() - 60 * 60 * 24
    });

    const replicaController = transformReplicationControllerData(items)[0];

    expect(replicaController.age.text).toEqual('1m');
  });
});
