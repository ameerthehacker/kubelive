'use strict';
const { executeAction } = require('../../actions/service');
const k8sApi = require('../../kube/api');

describe('executeAction()', () => {
  beforeEach(() => {
    k8sApi.deleteNamespacedService = jest.fn().mockResolvedValue();
  });

  it('should call k8sApi.deleteNameSpacedService(name, namespace) when key d is pressed', () => {
    const name = 'some-service-name';
    const namespace = 'some-namespace-name';
    executeAction({ name: 'd' }, name, namespace);

    expect(k8sApi.deleteNamespacedService).toHaveBeenCalledWith(
      name,
      namespace
    );
  });
});
