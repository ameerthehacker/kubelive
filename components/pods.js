'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const { TableComponent } = importJsx('./table');
const { actions, executeAction } = require('../actions/pod');

const PodsComponent = ({ items, namespace, stdin, setRawMode }) => {
  return (
    <TableComponent
      data={items}
      namespace={namespace}
      actions={actions}
      stdin={stdin}
      setRawMode={setRawMode}
      onActionPerformed={({ key, name, namespace }) =>
        executeAction(key, name, namespace)
      }
    />
  );
};

PodsComponent.propTypes = {
  items: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired,
  stdin: PropTypes.object.isRequired,
  setRawMode: PropTypes.func.isRequired
};

module.exports = PodsComponent;
