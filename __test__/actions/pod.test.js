'use strict';
const k8sApi = require('../../kube/api');
const mockActions = {
  baseActions: [
    {
      key: 'c',
      description: 'Copy'
    }
  ],
  baseExecuteAction: jest.fn()
};
jest.mock('../../actions/base', () => mockActions);
const { baseExecuteAction } = require('../../actions/base');
const { executeAction } = require('../../actions/pod');

describe('executeAction()', () => {
  beforeEach(() => {
    k8sApi.deleteNamespacedPod = jest.fn().mockResolvedValue();
  });

  it('should call k8sApi.deleteNameSpacedPod(name, namespace) when key d is pressed', () => {
    const name = 'some-pod-name';
    const namespace = 'some-namespace-name';
    executeAction({ name: 'd' }, name, namespace);

    expect(k8sApi.deleteNamespacedPod).toHaveBeenCalledWith(name, namespace);
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
