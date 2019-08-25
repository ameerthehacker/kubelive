'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const importJsx = require('import-jsx');
const App = importJsx('../../containers/app');
const Namespaces = importJsx('../../containers/namespaces');
const Pods = importJsx('../../containers/pods');
jest.mock('../../kube/api');

describe('App', () => {
  let container;
  let namespaceContainer;

  beforeEach(() => {
    container = shallow(<App />);
    namespaceContainer = container.find(Namespaces).first();
  });

  it('should match the snapshot', () => {
    expect(container).toMatchSnapshot();
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
