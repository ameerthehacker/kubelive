'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const importJsx = require('import-jsx');
const Base = importJsx('../../containers/base');
const { Color } = require('ink');
jest.mock('../../transformers/pod', () => ({
  transformPodData: jest.fn()
}));

describe('Base', () => {
  let base;
  let setStateMock;
  let refreshFn = 'refreshFn';
  const podsResponse = {
    body: {
      items: [{ metadata: { name: 'pod1' } }, { metadata: { name: 'pod2' } }]
    }
  };

  beforeEach(() => {
    base = new Base({
      componentRef: jest.fn().mockReturnValue(null),
      api: {
        [refreshFn]: jest.fn().mockResolvedValue(podsResponse)
      },
      transformer: jest.fn().mockReturnValue([
        {
          name: { text: 'pod1' }
        },
        {
          name: { text: 'pod2' }
        }
      ]),
      refreshFn
    });
    base.setState = setStateMock = jest.fn();
  });

  describe('setStateSafely', () => {
    let state;

    beforeEach(() => {
      state = { someState: 'something' };
    });

    it('should call this.setState only when the this.willComponentUnmount is false', () => {
      base.willComponentUnmount = false;

      base.setStateSafely(state);

      expect(setStateMock).toHaveBeenCalledWith(state);
    });

    it('should not call this.setState only when the this.willComponentUnmount is true', () => {
      base.willComponentUnmount = true;

      base.setStateSafely(state);

      expect(setStateMock).not.toHaveBeenCalledWith(state);
    });
  });

  describe('getSnapshotBeforeUpdate()', () => {
    it('should call listenForChanges(namespace) when there is a change in namespace for namespaced respurce', () => {
      base.listenForChanges = jest.fn();
      base.props.namespace = 'namespace2';
      base.props.isNamespaced = true;

      base.getSnapshotBeforeUpdate({
        namespace: 'namespace1'
      });

      expect(base.listenForChanges).toHaveBeenCalledWith('namespace2');
    });

    it('should not call listenForChanges(namespace) when there is no change in namespace', () => {
      base.listenForChanges = jest.fn();
      base.props.namespace = 'namespace1';

      base.getSnapshotBeforeUpdate({
        namespace: 'namespace1'
      });

      expect(base.listenForChanges).not.toHaveBeenCalled();
    });

    it('should not call listenForChanges(namespace) when there is a error', () => {
      base.listenForChanges = jest.fn();
      base.props.namespace = 'namespace1';
      base.state.err = { code: 'ENOTFOUND' };

      base.getSnapshotBeforeUpdate({
        namespace: 'namespace2'
      });

      expect(base.listenForChanges).not.toHaveBeenCalled();
    });
  });

  describe('componentWillUnmount()', () => {
    it('should set this.willComponentUnmount=false when the component unmounts', () => {
      base.willComponentUnmount = false;

      base.componentWillUnmount();

      expect(base.willComponentUnmount).toBeTruthy();
    });

    it('should clear the timer if it exists', () => {
      global.clearInterval = jest.fn();
      base.timer = 1234;

      base.componentWillUnmount();

      expect(global.clearInterval).toHaveBeenCalledWith(base.timer);
    });

    it('should not clear the timer if it does not exists', () => {
      global.clearInterval = jest.fn();
      base.timer = undefined;

      base.componentWillUnmount();

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
      const timer = (base.timer = 1234);

      base.listenForChanges(namespace);

      expect(clearIntervalMock).toHaveBeenCalledWith(timer);
    });

    it('should set the timer to what setInterval returns', () => {
      const timer = 'some-timer-object';
      base.timer = false;
      global.setInterval = jest.fn().mockReturnValue(timer);

      base.listenForChanges(namespace);

      expect(base.timer).toEqual(timer);
    });

    it('should call setInterval()', () => {
      base.listenForChanges(namespace);

      expect(global.setInterval).toHaveBeenCalled();
    });

    it('should call base.api.refreshFn(namespace)', () => {
      base.listenForChanges(namespace);

      expect(base.props.api.refreshFn).toHaveBeenCalledWith(namespace);
    });

    it('should call transformPodData(items)', () => {
      expect.assertions(1);
      base.listenForChanges(namespace);

      base.props.api.refreshFn().then(() => {
        expect(base.props.transformer).toHaveBeenCalledWith(
          podsResponse.body.items
        );
      });
    });

    it('should call setStateSafely(pods) when there is no error', () => {
      expect.assertions(1);
      const setStateSafelyMock = (base.setStateSafely = jest.fn());
      const transformPodDataResult = [{ name: 'pod1' }, { name: 'pod2' }];
      base.props.transformer = jest
        .fn()
        .mockReturnValue(transformPodDataResult);

      base.listenForChanges(namespace);

      base.props.api.refreshFn().then(() => {
        expect(setStateSafelyMock).toHaveBeenCalledWith({
          items: transformPodDataResult
        });
      });
    });

    it('should call setStateSafely({ err }) when there is error', () => {
      expect.assertions(1);
      const setStateSafelyMock = (base.setStateSafely = jest.fn());
      base.props.api.refreshFn = jest
        .fn()
        .mockRejectedValue({ code: 'ENOTFOUND' });

      base.listenForChanges(namespace);

      base.props.api
        .refreshFn()
        .then()
        .catch((err) => {
          expect(setStateSafelyMock).toHaveBeenCalledWith({
            ...base.state,
            err: err.code
          });
        });
    });
  });
});

describe('Base', () => {
  const namespace = 'some-namespace';
  const refreshFn = 'refreshFn';
  const componentRef = () => 'something';
  const createBase = (
    props = {
      namespace,
      api: { [refreshFn]: Promise.resolve({}) },
      refreshFn,
      componentRef,
      isNamespaced: true,
      stdin: { on: () => {} },
      setRawMode: () => {}
    }
  ) => shallow(<Base {...props} />);

  describe('render()', () => {
    it('should render the PodsComponent with namspace prop as this.props.namespace when there is no error', () => {
      const base = createBase();

      const renderComponent = base.find(componentRef).first();

      expect(renderComponent.props().namespace).toEqual(namespace);
    });

    it('should render the PodsComponent with pods prop as this.state.pods when there is no error', () => {
      const base = createBase();

      base.setState({
        ...base.state(),
        items: [{ name: 'pod1' }]
      });
      base.update();

      const renderComponent = base.find(componentRef).first();

      expect(renderComponent.props().items).toEqual(base.state().items);
    });

    it('should render the color component with error when there is an error', () => {
      const errCode = 'ENOTFOUND';
      const base = createBase();

      base.setState({
        err: errCode
      });

      base.update();
      const colorComponent = base.find(Color).first();
      expect(colorComponent.render().text()).toContain(errCode);
    });
  });
});
