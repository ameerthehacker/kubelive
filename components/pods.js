const React = require('react');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const TableComponent = importJsx('./table');

const PodsComponent = ({ pods }) => {
  return <TableComponent data={pods} />
}

PodsComponent.propTypes = {
  pods: PropTypes.array.isRequired
};

module.exports = PodsComponent;