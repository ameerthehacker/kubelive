'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const { TableComponent } = importJsx('./table');
const { actions, executeAction } = require('../actions/services');

const ServicesComponent = ({ items, namespace }) => {
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

ServicesComponent.propTypes = {
  items: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
};

module.exports = ServicesComponent;
