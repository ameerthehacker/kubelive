const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const TableComponent = importJsx('./table');
const { actions, executeAction } = require('../actions/pod'); 

const PodsComponent = ({ pods, namespace }) => {
  return <TableComponent data={pods} namespace={namespace} actions={actions} onActionPerformed={({ key, name, namespace }) => executeAction(key, name, namespace)} />
}

PodsComponent.propTypes = {
  pods: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
};

module.exports = PodsComponent;