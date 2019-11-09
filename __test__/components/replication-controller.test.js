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
jest.mock('../../src/actions/replication-controller', () => mockActions);
const { actions } = require('../../src/actions/replication-controller');
const importJsx = require('import-jsx');
const ReplicationControllerComponent = importJsx(
  '../../src/components/replication-controllers'
);
const { TableComponent } = importJsx('../../src/components/table');

describe('ReplicationControllerComponent', () => {
  let component;
  let tableComponent;
  const pods = [
    {
      name: 'some-replication-controller-name'
    }
  ];
  let namespace = 'some-name';

  beforeEach(() => {
    component = shallow(
      <ReplicationControllerComponent
        items={pods}
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

  it('tableComponent should get passed the data props as replication controllers', () => {
    expect(tableComponent.props().data).toEqual(pods);
  });

  it('tableComponent should get passed the namespace props', () => {
    expect(tableComponent.props().namespace).toEqual(namespace);
  });

  it('tableComponent should get passed the actions props', () => {
    expect(tableComponent.props().actions).toEqual(actions);
  });

  it('tableComponent should call executeAction(key, name, namespace) when onActionPerformed is called', () => {
    const key = { name: 'c' };
    const name = 'some-pod-name';

    tableComponent.invoke('onActionPerformed')({ key, name, namespace });

    expect(executeActionMock).toHaveBeenCalledWith(key, name, namespace);
  });
});
