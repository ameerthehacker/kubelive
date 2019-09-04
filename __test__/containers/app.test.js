'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const importJsx = require('import-jsx');
const App = importJsx('../../containers/app');
const Namespaces = importJsx('../../containers/namespaces');
const Pods = importJsx('../../containers/pods');
const { Color } = require('ink');
jest.mock('../../kube/api');

describe('App', () => {
  let component;

  beforeEach(() => {
    component = new App({});
    component.setState = jest.fn();
  });

  describe('getResourceComponent', () => {
    it('should return <PodComponent /> when the resource is pod', () => {
      component.props.resource = 'pod';
      const namespace = (component.state.selectedNamespace = 'some-namespace');

      expect(component.getResourceComponent()).toEqual(
        <Pods namespace={namespace} />
      );
    });

    it('should return <PodComponent /> when the resource is pods', () => {
      component.props.resource = 'pods';
      const namespace = (component.state.selectedNamespace = 'some-namespace');

      expect(component.getResourceComponent()).toEqual(
        <Pods namespace={namespace} />
      );
    });

    it('should return false when the resource is not found', () => {
      component.props.resource = 'some-other-resource';

      expect(component.getResourceComponent()).toBeFalsy();
    });
  });

  describe('render()', () => {
    let container;
    let namespaceContainer;

    beforeEach(() => {
      // TODO: fix the hard coded resource after writting additional tests
      container = shallow(<App resource="pod" />);
      namespaceContainer = container.find(Namespaces).first();
    });

    it('should match the snapshot', () => {
      expect(container).toMatchSnapshot();
    });

    it('should render Color component when the resource is found', () => {
      container.setProps({
        ...container.props(),
        resource: 'some-other-resource'
      });

      container.update();

      const colorComponent = container.find(Color);

      expect(colorComponent.exists()).toBeTruthy();
    });

    it('should render the component when the resource is found', () => {
      container.setProps({
        ...container.props(),
        resource: 'pods'
      });

      container.update();

      const podsComponent = container.find(Pods);
      expect(podsComponent.exists()).toBeTruthy();
    });

    it('should call getResourceComponent(resource) during render()', () => {
      container.instance().getResourceComponent = jest.fn();

      container.instance().forceUpdate();

      expect(container.instance().getResourceComponent).toHaveBeenCalled();
    });

    it('should set the Namespaces onNamespaceChange prop to this.onNamespaceChange', () => {
      expect(namespaceContainer.props().onNamespaceChange).toBe(
        container.instance().onNamespaceChange
      );
    });

    it('should call setState({ selectedNamespace }) when there is change in namespace', () => {
      const namespace = 'some-namespace-name';
      container.instance().onNamespaceChange(namespace);

      expect(container.state().selectedNamespace).toEqual(namespace);
    });

    it('should set the Pods namespace prop to this.state.selectedNamespace', () => {
      const namespace = 'some-namespace';

      container.setState({
        ...container.state(),
        selectedNamespace: namespace
      });
      container.update();
      const podsContainer = container.find(Pods).first();

      expect(podsContainer.props().namespace).toBe(
        container.state().selectedNamespace
      );
    });
  });
});
