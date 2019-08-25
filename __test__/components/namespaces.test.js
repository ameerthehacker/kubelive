'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const importJsx = require('import-jsx');
const NamespacesComponent = importJsx('../../components/namespaces');
const { Tab, Tabs } = require('ink-tab');

describe('NamespacesComponent', () => {
  const namespaces = [
    {
      metadata: {
        name: 'default'
      }
    },
    {
      metadata: {
        name: 'kube-system'
      }
    }
  ];
  const onNamespaceChangeMock = jest.fn();
  let component;
  let tabsComponent;
  let tabComponents;

  beforeEach(() => {
    component = shallow(
      <NamespacesComponent
        namespaces={namespaces}
        onNamespaceChange={onNamespaceChangeMock}
      />
    );
    onNamespaceChangeMock.mockClear();
    tabsComponent = component.find(Tabs).first();
    tabComponents = tabsComponent.find(Tab);
  });

  it('should match the snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('Tabs component should get passed the onChange prop as onNamespaceChange', () => {
    const name = 'some-namespace';

    tabsComponent.invoke('onChange')(name);

    expect(onNamespaceChangeMock).toHaveBeenCalledWith(name);
  });

  it('Tabs component should get passed keyMap prop as {useNumbers: true, useTabs: true}', () => {
    expect(tabsComponent.props().keyMap).toEqual({
      useNumbers: true,
      useTabs: true
    });
  });

  it('should render the tab children with key as namespace name', () => {
    tabComponents.forEach((tabComponent, index) => {
      expect(tabComponent.key()).toEqual(namespaces[index].metadata.name);
    });
  });

  it('should render the tab children with name prop as namespace name', () => {
    tabComponents.forEach((tabComponent, index) => {
      expect(tabComponent.props().name).toEqual(
        namespaces[index].metadata.name
      );
    });
  });

  it('should render the tab children with namespace name as content', () => {
    tabComponents.forEach((tabComponent, index) => {
      expect(tabComponent.childAt(0).text()).toEqual(
        namespaces[index].metadata.name
      );
    });
  });
});
