'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const Namespaces = importJsx('../../containers/namespaces');
const NamespacesComponent = importJsx('../../components/namespaces');
const k8sApi = require('../../kube/api');
const { shallow } = require('enzyme');
const { Color } = require('ink');

const createNamespaceContainer = (props, listNamespaceMock) => {
  k8sApi.listNamespace = listNamespaceMock;

  return shallow(<Namespaces {...props} />);
};

describe('Namespaces', () => {
  it('should call k8Api.listNamespace() when component mounts', () => {
    const listNamespaceMock = jest.fn().mockResolvedValue({
      body: {
        items: []
      }
    });
    createNamespaceContainer({}, listNamespaceMock);

    expect(k8sApi.listNamespace).toHaveBeenCalled();
  });

  it('should call this.props.onNamespaceChange(namespace) when component mounts with atleast one namespace available', () => {
    expect.assertions(1);
    const listNamespaceMock = jest.fn().mockResolvedValue({
      body: {
        items: [
          {
            metadata: { name: 'some-namespace' }
          }
        ]
      }
    });
    const onNamespaceChangeMock = jest.fn();
    createNamespaceContainer(
      {
        onNamespaceChange: onNamespaceChangeMock
      },
      listNamespaceMock
    );

    listNamespaceMock().then((response) => {
      expect(onNamespaceChangeMock).toHaveBeenCalledWith(
        response.body.items[0].metadata.name
      );
    });
  });

  it('should set the namespaces props to resolved props', () => {
    expect.assertions(1);
    const listNamespaceMock = jest.fn().mockResolvedValue({
      body: {
        items: [
          { metadata: { name: 'namespaces1' } },
          { metadata: { name: 'namespaces2' } }
        ]
      }
    });
    const namespaces = createNamespaceContainer({}, listNamespaceMock);

    listNamespaceMock().then((response) => {
      namespaces.update();
      const namespacesComponent = namespaces.find(NamespacesComponent).first();
      expect(namespacesComponent.props().namespaces).toEqual(
        response.body.items
      );
    });
  });

  it('should set the onNamespaceChange props to this.props.onNamespaceChange', () => {
    const listNamespaceMock = jest.fn().mockResolvedValue({
      body: {
        items: []
      }
    });
    const onNamespaceChange = () => {};

    const namespaces = createNamespaceContainer(
      { onNamespaceChange },
      listNamespaceMock
    );

    const namespacesComponent = namespaces.find(NamespacesComponent).first();
    expect(namespacesComponent.props().onNamespaceChange).toBe(
      onNamespaceChange
    );
  });

  it('should return error with red color when the promise fails', () => {
    expect.assertions(1);
    const listNamespaceMock = jest.fn().mockReturnValue(
      Promise.reject({
        code: 'ENOTFOUND'
      })
    );
    const namespaces = createNamespaceContainer({}, listNamespaceMock);

    listNamespaceMock()
      .then()
      .catch((err) => {
        namespaces.update();
        const colorComponent = namespaces.find(Color).first();
        expect(colorComponent.render().text()).toContain(err.code);
      });
  });
});
