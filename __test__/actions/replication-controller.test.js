'use strict';
const { executeAction } = require('../../actions/replication-controller');
const k8sApi = require('../../kube/api');

describe('executeAction()', () => {
  beforeEach(() => {
    k8sApi.deleteNamespacedReplicationController = jest
      .fn()
      .mockResolvedValue();
  });

  it('should call k8sApi.deleteNamespacedReplicationController(name, namespace) when key d is pressed', () => {
    const name = 'some-replication-controller-name';
    const namespace = 'some-namespace-name';
    executeAction({ name: 'd' }, name, namespace);

    expect(k8sApi.deleteNamespacedReplicationController).toHaveBeenCalledWith(
      name,
      namespace
    );
  });
});
