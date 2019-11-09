'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const { TableComponent } = importJsx('./table');
const { actions, executeAction } = require('../actions/replication-controller');

const ReplicationControllerControllers = ({
  items,
  namespace,
  stdin,
  setRawMode
}) => {
  return (
    <TableComponent
      data={items}
      namespace={namespace}
      stdin={stdin}
      setRawMode={setRawMode}
      actions={actions}
      onActionPerformed={({ key, name, namespace }) =>
        executeAction(key, name, namespace)
      }
    />
  );
};

ReplicationControllerControllers.propTypes = {
  items: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired,
  stdin: PropTypes.object.isRequired,
  setRawMode: PropTypes.func.isRequired
};

module.exports = ReplicationControllerControllers;
