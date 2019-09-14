'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const { TableComponent } = importJsx('./table');
const {
  actions,
  executeAction
} = require('../actions/replication-controllers');

const ReplicationControllerControllers = ({ items, namespace }) => {
  return (
    <TableComponent
      data={items}
      namespace={namespace}
      actions={actions}
      onActionPerformed={({ key, name, namespace }) =>
        executeAction(key, name, namespace)
      }
    />
  );
};

ReplicationControllerControllers.propTypes = {
  items: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
};

module.exports = ReplicationControllerControllers;
