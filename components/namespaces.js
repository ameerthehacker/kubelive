const React = require('react');
const { Tab, Tabs } = require('ink-tab');
const PropTypes = require('prop-types');

const NamespacesComponent = ({namespaces, onNamespaceChange}) => {  
  return (
    <Tabs onChange={(name) => onNamespaceChange(name)} keyMap={{useNumbers: true, useTabs: true}}>
      {namespaces.map(namespace => <Tab key={namespace.metadata.name} name={namespace.metadata.name}>{namespace.metadata.name}</Tab>)}
    </Tabs>
  )
}

NamespacesComponent.propTypes = {
  namespaces: PropTypes.array.isRequired,
  onNamespaceChange: PropTypes.func
};

module.exports = NamespacesComponent;