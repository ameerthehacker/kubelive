'use strict';
const { executeAction } = require('../../actions/node');
const k8sApi = require('../../kube/api');

describe('executeAction()', () => {
  beforeEach(() => {
    k8sApi.deleteNode = jest.fn().mockResolvedValue();
  });

  it('should call k8sApi.deleteNode(name) when key d is pressed', () => {
    const name = 'some-node-name';
    executeAction({ name: 'd' }, name);

    expect(k8sApi.deleteNode).toHaveBeenCalledWith(name);
  });
});
