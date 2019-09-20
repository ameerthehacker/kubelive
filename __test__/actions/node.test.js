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
const { executeAction } = require('../../actions/node');

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
