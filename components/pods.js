const React = require('react');
const { Text } = require('ink');
const propTypes = require('prop-types');

const PodsComponent = (props) => {  
  return props.pods.map(pod => <Text key={pod.metadata.name}>{pod.metadata.name}</Text>);
}

PodsComponent.propTypes = {
  pods: propTypes.array
};

module.exports = PodsComponent;