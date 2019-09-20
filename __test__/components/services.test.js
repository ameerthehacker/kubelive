'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const executeActionMock = jest.fn();
const mockActions = {
  actions: [
    {
      key: 'c',
      descrition: 'Copy'
    }
  ],
  executeAction: executeActionMock
};
jest.mock('../../actions/service', () => mockActions);
const { actions } = require('../../actions/service');
const importJsx = require('import-jsx');
const ServicesComponent = importJsx('../../components/services');
const { TableComponent } = importJsx('../../components/table');

describe('ServicesComponent', () => {
  let component;
  let tableComponent;
  const services = [
    {
      name: 'some-service-name'
    }
  ];
  let namespace = 'some-name';

  beforeEach(() => {
    component = shallow(
      <ServicesComponent
        items={services}
        stdin={{ on: () => {} }}
        setRawMode={() => {}}
        namespace={namespace}
      />
    );
    tableComponent = component.find(TableComponent).first();
    executeActionMock.mockClear();
  });

  it('should match the snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('tableComponent should get passed the data props as services', () => {
    expect(tableComponent.props().data).toEqual(services);
  });

  it('tableComponent should get passed the namespace props', () => {
    expect(tableComponent.props().namespace).toEqual(namespace);
  });

  it('tableComponent should get passed the actions props', () => {
    expect(tableComponent.props().actions).toEqual(actions);
  });

  it('tableComponent should call executeAction(key, name, namespace) when onActionPerformed is called', () => {
    const key = { name: 'c' };
    const name = 'some-service-name';

    tableComponent.invoke('onActionPerformed')({ key, name, namespace });

    expect(executeActionMock).toHaveBeenCalledWith(key, name, namespace);
  });
});
