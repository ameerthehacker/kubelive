'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const importJsx = require('import-jsx');
const App = importJsx('../../src/containers/app');
const Namespaces = importJsx('../../src/containers/namespaces');
const Pods = importJsx('../../src/containers/pods');
const Nodes = importJsx('../../src/containers/nodes');
const Services = importJsx('../../src/containers/services');
const ReplicationController = importJsx(
  '../../src/containers/replication-controllers'
);
const { Color } = require('ink');
jest.mock('../../src/kube/api');

describe('App', () => {
  let component;

  beforeEach(() => {
    component = new App({});
    component.setState = jest.fn();
  });

  describe('getResourceComponent', () => {
    it('should return PodComponent when the resource is pod', () => {
      component.props.resource = 'pod';

      expect(component.getResourceComponent()).toEqual(Pods);
    });

    it('should return PodComponent when the resource is pods', () => {
      component.props.resource = 'pods';

      expect(component.getResourceComponent()).toEqual(Pods);
    });

    it('should return ServiceComponent when the resource is service', () => {
      component.props.resource = 'service';

      expect(component.getResourceComponent()).toEqual(Services);
    });

    it('should return ServiceComponent when the resource is services', () => {
      component.props.resource = 'services';

      expect(component.getResourceComponent()).toEqual(Services);
    });

    it('should return ReplicationControllerComponent when the resource is replication controller', () => {
      component.props.resource = 'replicationcontroller';

      expect(component.getResourceComponent()).toEqual(ReplicationController);
    });

    it('should return ReplicationControllerComponent when the resource is replication controllers', () => {
      component.props.resource = 'replicationcontrollers';

      expect(component.getResourceComponent()).toEqual(ReplicationController);
    });

    it('should return NodeComponent when the resource is node', () => {
      component.props.resource = 'node';

      expect(component.getResourceComponent()).toEqual(Nodes);
    });

    it('should return NodeComponent when the resource is nodes', () => {
      component.props.resource = 'nodes';

      expect(component.getResourceComponent()).toEqual(Nodes);
    });

    it('should set isNamespaced to false when the resource is node', () => {
      component.props.resource = 'node';

      component.getResourceComponent();

      expect(component.isNamespaced).toBeFalsy();
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

    it('should render the namespace component only when isNamespaced is true', () => {
      container.setProps({
        ...container.props(),
        resource: 'pods'
      });
      container.isNamespaced = true;

      container.instance().forceUpdate();

      const namespaceComponent = container.find(Namespaces);
      expect(namespaceComponent.exists()).toBeTruthy();
    });

    it('should not render the namespace component isNamespaced is false', () => {
      container.setProps({
        ...container.props(),
        resource: 'nodes'
      });
      container.isNamespaced = false;

      container.instance().forceUpdate();

      const namespaceComponent = container.find(Namespaces);
      expect(namespaceComponent.exists()).toBeFalsy();
    });

    it('should render the component when the resource is found', () => {
      container.setProps({
        ...container.props(),
        resource: 'pods'
      });

      container.instance().forceUpdate();

      const podsComponent = container.find(Pods);
      expect(podsComponent).toBeTruthy();
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
  });
});
