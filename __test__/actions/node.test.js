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
const { executeAction } = require('../../src/actions/node');

describe('executeAction()', () => {
  beforeEach(() => {
    k8sApi.deleteNode = jest.fn().mockResolvedValue();
  });

  it('should call k8sApi.deleteNode(name) when key d is pressed', () => {
    const name = 'some-node-name';
    executeAction({ name: 'd' }, name);

    expect(k8sApi.deleteNode).toHaveBeenCalledWith(name);
  });

  it('should call baseExecute action when nothing matches', () => {
    const keyName = 'some-unknown-key';
    const name = 'some-node-name';
    executeAction({ name: keyName }, name);

    expect(baseExecuteAction).toHaveBeenCalledWith({ name: keyName }, name);
  });
});
