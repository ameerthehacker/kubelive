const React = require('react');
const { Tab, Tabs } = require('ink-tab');
const propTypes = require('prop-types');

const NamespacesComponent = ({namespaces, onNamespaceChange}) => {  
  return (
    <Tabs onChange={(name) => onNamespaceChange(name)} keyMap={{useNumbers: true, useTabs: true}}>
      {namespaces.map(namespace => <Tab key={namespace.metadata.name} name={namespace.metadata.name}>{namespace.metadata.name}</Tab>)}
    </Tabs>
  )
}

NamespacesComponent.propTypes = {
  namespaces: propTypes.array,
  onNamespaceChange: propTypes.func
};

module.exports = NamespacesComponent;