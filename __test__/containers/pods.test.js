'use strict';
const k8sApi = require('../../kube/api');
const importJsx = require('import-jsx');
const Pods = importJsx('../../containers/pods');
const { transformPodData } = require('../../transformers/pod');
jest.mock('../../transformers/pod', () => ({
  transformPodData: jest.fn()
}));

describe('Pods', () => {
  let pods;
  let listNamespacedPodMock;
  let setStateMock;
  const response = {
    body: {
      items: [{ metadata: { name: 'pod1' } }, { metadata: { name: 'pod2' } }]
    }
  };

  beforeEach(() => {
    listNamespacedPodMock = k8sApi.listNamespacedPod = jest
      .fn()
      .mockResolvedValue(response);
    pods = new Pods({});
    pods.setState = setStateMock = jest.fn();
  });

  describe('setStateSafely', () => {
    let state;

    beforeEach(() => {
      state = { someState: 'something' };
    });

    it('should call this.setState only when the this.willComponentUnmount is false', () => {
      pods.willComponentUnmount = false;

      pods.setStateSefely(state);

      expect(setStateMock).toHaveBeenCalledWith(state);
    });

    it('should not call this.setState only when the this.willComponentUnmount is true', () => {
      pods.willComponentUnmount = true;

      pods.setStateSefely(state);

      expect(setStateMock).not.toHaveBeenCalledWith(state);
    });
  });

  describe('getSnapshotBeforeUpdate()', () => {
    it('should call listenForChanges(namespace) when there is a change in namespace', () => {
      pods.listenForChanges = jest.fn();
      pods.props.namespace = 'namespace2';

      pods.getSnapshotBeforeUpdate({
        namespace: 'namespace1'
      });

      expect(pods.listenForChanges).toHaveBeenCalledWith('namespace2');
    });

    it('should not call listenForChanges(namespace) when there is no change in namespace', () => {
      pods.listenForChanges = jest.fn();
      pods.props.namespace = 'namespace1';

      pods.getSnapshotBeforeUpdate({
        namespace: 'namespace1'
      });

      expect(pods.listenForChanges).not.toHaveBeenCalled();
    });

    it('should not call listenForChanges(namespace) when there is a error', () => {
      pods.listenForChanges = jest.fn();
      pods.props.namespace = 'namespace1';
      pods.state.err = { code: 'ENOTFOUND' };

      pods.getSnapshotBeforeUpdate({
        namespace: 'namespace2'
      });

      expect(pods.listenForChanges).not.toHaveBeenCalled();
    });
  });

  describe('componentWillUnmount()', () => {
    it('should set this.willComponentUnmount=false when the component unmounts', () => {
      pods.willComponentUnmount = false;

      pods.componentWillUnmount();

      expect(pods.willComponentUnmount).toBeTruthy();
    });

    it('should clear the timer if it exists', () => {
      global.clearInterval = jest.fn();
      pods.timer = 1234;

      pods.componentWillUnmount();

      expect(global.clearInterval).toHaveBeenCalledWith(pods.timer);
    });

    it('should not clear the timer if it does not exists', () => {
      global.clearInterval = jest.fn();
      pods.timer = undefined;

      pods.componentWillUnmount();

      expect(global.clearInterval).not.toHaveBeenCalled();
    });
  });

  describe('listenForChanges()', () => {
    const namespace = 'some-namespace';
    let clearIntervalMock;

    beforeEach(() => {
      global.clearInterval = clearIntervalMock = jest.fn();
      global.setInterval = jest
        .fn()
        .mockImplementation((callback) => callback.call());
    });

    it('should clear the timer if it already exists', () => {
      const timer = (pods.timer = 1234);

      pods.listenForChanges(namespace);

      expect(clearIntervalMock).toHaveBeenCalledWith(timer);
    });

    it('should set the timer to what setInterval returns', () => {
      const timer = 'some-timer-object';
      pods.timer = false;
      global.setInterval = jest.fn().mockReturnValue(timer);

      pods.listenForChanges(namespace);

      expect(pods.timer).toEqual(timer);
    });

    it('should call setInterval()', () => {
      pods.listenForChanges(namespace);

      expect(global.setInterval).toHaveBeenCalled();
    });

    it('should call k8Api.listNamespacedPod(namespace)', () => {
      pods.listenForChanges(namespace);

      expect(k8sApi.listNamespacedPod).toHaveBeenCalledWith(namespace);
    });

    it('should call transformPodData(items)', () => {
      expect.assertions(1);
      pods.listenForChanges(namespace);

      listNamespacedPodMock().then(() => {
        expect(transformPodData).toHaveBeenCalledWith(response.body.items);
      });
    });

    it('should call setStateSafely(pods) when there is no error', () => {
      expect.assertions(1);
      const setStateSafelyMock = (pods.setStateSefely = jest.fn());
      const transformPodDataResult = [{ name: 'pod1' }, { name: 'pod2' }];
      transformPodData.mockReturnValue(transformPodDataResult);

      pods.listenForChanges(namespace);

      listNamespacedPodMock().then(() => {
        expect(setStateSafelyMock).toHaveBeenCalledWith({
          pods: transformPodDataResult
        });
      });
    });

    it('should call setStateSafely({ err }) when there is error', () => {
      expect.assertions(1);
      k8sApi.listNamespacedPod = jest.fn().mockRejectedValue({
        code: 'ENOTFOUND'
      });
      const setStateSafelyMock = (pods.setStateSefely = jest.fn());

      pods.listenForChanges(namespace);

      k8sApi
        .listNamespacedPod()
        .then()
        .catch((err) => {
          expect(setStateSafelyMock).toHaveBeenCalledWith({
            ...pods.state,
            err: err.code
          });
        });
    });
  });
});
