const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const TableComponent = importJsx('./table');
const { actions, executeAction } = require('../actions/pod'); 

const PodsComponent = ({ pods }) => {
  return <TableComponent data={pods} actions={actions} onActionPerformed={({ key, name }) => executeAction(key, name)} />
}

PodsComponent.propTypes = {
  pods: PropTypes.array.isRequired
};

module.exports = PodsComponent;