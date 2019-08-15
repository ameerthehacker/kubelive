const React = require('react');
const { Tab, Tabs } = require('ink-tab');
const propTypes = require('prop-types');

const NamespacesComponent = ({namespaces}) => {  
  return (
    <Tabs onChange={() => {}}>
      {namespaces.map(namespace => <Tab key={namespace.metadata.name} name={namespace.metadata.name}>{namespace.metadata.name}</Tab>)}
    </Tabs>
  )
}

NamespacesComponent.propTypes = {
  namespaces: propTypes.array
};

module.exports = NamespacesComponent;