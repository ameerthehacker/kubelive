'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const Namespaces = importJsx('../../containers/namespaces');
const NamespacesComponent = importJsx('../../components/namespaces');
const k8sApi = require('../../kube/api');
const { shallow } = require('enzyme');
const { Color } = require('ink');

describe('Namespaces', () => {
  const createNamespaceContainer = (props, listNamespaceMock) => {
    k8sApi.listNamespace = listNamespaceMock;
    const namespacesContainer = new Namespaces(props);
    namespacesContainer.setState = jest.fn();

    return namespacesContainer;
  };

  describe('componentDidMount()', () => {
    it('should call k8Api.listNamespace()', () => {
      const listNamespaceMock = jest.fn().mockResolvedValue({
        body: {
          items: []
        }
      });
      const namespaces = createNamespaceContainer({}, listNamespaceMock);

      namespaces.componentDidMount();

      expect(k8sApi.listNamespace).toHaveBeenCalled();
    });

    it('should call this.props.onNamespaceChange(namespace) when atleast one namespace available', () => {
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
      const namespaces = createNamespaceContainer(
        {
          onNamespaceChange: onNamespaceChangeMock
        },
        listNamespaceMock
      );

      namespaces.componentDidMount();

      listNamespaceMock().then((response) => {
        expect(onNamespaceChangeMock).toHaveBeenCalledWith(
          response.body.items[0].metadata.name
        );
      });
    });
  });
});

describe('Namespaces', () => {
  const createNamespaceContainer = (props, listNamespaceMock) => {
    k8sApi.listNamespace = listNamespaceMock;

    return shallow(<Namespaces {...props} />);
  };

  describe('render()', () => {
    it('should match the snapshot', () => {
      const listNamespaceMock = jest.fn().mockResolvedValue({
        body: {
          items: []
        }
      });
      const namespaces = createNamespaceContainer({}, listNamespaceMock);

      expect(namespaces).toMatchSnapshot();
    });

    it('should set the namespaces props to resolved props', () => {
      const items = [
        {
          metadata: { name: 'namespace1' }
        }
      ];
      const listNamespaceMock = jest.fn().mockResolvedValue({
        body: {
          items
        }
      });
      const namespaces = createNamespaceContainer({}, listNamespaceMock);

      namespaces.setState({ namespaces: items });

      namespaces.update();
      const namespacesComponent = namespaces.find(NamespacesComponent).first();
      expect(namespacesComponent.props().namespaces).toEqual(items);
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
      const errCode = 'ENOTFOUND';
      const listNamespaceMock = jest.fn().mockRejectedValue({
        code: errCode
      });
      const namespaces = createNamespaceContainer({}, listNamespaceMock);

      namespaces.setState({ err: errCode });

      namespaces.update();
      const colorComponent = namespaces.find(Color).first();
      expect(colorComponent.render().text()).toContain(errCode);
    });
  });
});
