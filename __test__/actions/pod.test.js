const { executeAction } = require('../../actions/pod');
const k8sApi = require('../../kube-api');
const clipboardy = require('clipboardy');

describe('executeAction()', () => {

  beforeEach(() => {
    k8sApi.deleteNamespacedPod = jest.fn().mockResolvedValue();
    clipboardy.writeSync = jest.fn().mockResolvedValue();
  });

  it('should call k8sApi.deleteNameSpacedPod(name, namespace) when key d is pressed', () => {
    const name = 'some-pod-name';
    const namespace = 'some-namespace-name';
    executeAction({ name: 'd' }, name, namespace);

    expect(k8sApi.deleteNamespacedPod).toHaveBeenCalledWith(name, namespace);
  });

  it('should call clipboardy.writeSync()', () => {
    const name = 'some-pod-name';
    executeAction({ name: 'c' }, name);

    expect(clipboardy.writeSync).toHaveBeenCalledWith(name);
  });
});