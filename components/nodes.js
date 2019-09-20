'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const { TableComponent } = importJsx('./table');
const { actions, executeAction } = require('../actions/node');

const NodesComponent = ({ items, stdin, setRawMode }) => {
  return (
    <TableComponent
      data={items}
      stdin={stdin}
      setRawMode={setRawMode}
      actions={actions}
      onActionPerformed={({ key, name }) => executeAction(key, name)}
    />
  );
};

NodesComponent.propTypes = {
  items: PropTypes.array.isRequired,
  stdin: PropTypes.object.isRequired,
  setRawMode: PropTypes.func.isRequired
};

module.exports = NodesComponent;
