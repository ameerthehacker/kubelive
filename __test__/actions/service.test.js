'use strict';
const k8sApi = require('../../src/kube/api');
const mockActions = {
  baseActions: [
    {
      key: 'c',
      description: 'Copy'
    }
  ],
  baseExecuteAction: jest.fn()
};
jest.mock('../../src/actions/base', () => mockActions);
const { baseExecuteAction } = require('../../src/actions/base');
const { executeAction } = require('../../src/actions/service');

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

  it('should call baseExecute action when nothing matches', () => {
    const keyName = 'some-unknown-key';
    const name = 'some-node-name';
    const namespace = 'some-namespace';
    executeAction({ name: keyName }, name, namespace);

    expect(baseExecuteAction).toHaveBeenCalledWith(
      { name: keyName },
      name,
      namespace
    );
  });
});
