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
jest.mock('../../src/actions/pod', () => mockActions);
const { actions } = require('../../src/actions/pod');
const importJsx = require('import-jsx');
const NodesComponent = importJsx('../../src/components/pods');
const { TableComponent } = importJsx('../../src/components/table');

describe('NodesComponent', () => {
  let component;
  let tableComponent;
  const pods = [
    {
      name: 'some-node-name'
    }
  ];

  beforeEach(() => {
    component = shallow(
      <NodesComponent
        items={pods}
        stdin={{ on: () => {} }}
        setRawMode={() => {}}
      />
    );
    tableComponent = component.find(TableComponent).first();
    executeActionMock.mockClear();
  });

  it('should match the snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('tableComponent should get passed the data props as nodes', () => {
    expect(tableComponent.props().data).toEqual(pods);
  });

  it('tableComponent should get passed the actions props', () => {
    expect(tableComponent.props().actions).toEqual(actions);
  });

  it('tableComponent should call executeAction(key, name) when onActionPerformed is called', () => {
    const key = { name: 'c' };
    const name = 'some-pod-name';

    tableComponent.invoke('onActionPerformed')({ key, name });

    expect(executeActionMock).toHaveBeenCalledWith(key, name, undefined);
  });
});
