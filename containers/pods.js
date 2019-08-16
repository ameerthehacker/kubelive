const k8sApi = require('../kube-api');
const React = require('react');
const importJsx = require('import-jsx');
const PodsComponent = importJsx('../components/pods');
const { Component } = require('react');
const propTypes = require('prop-types');

class Pods extends Component {
  constructor(props) {
    super(props);
    this.state = { pods: [] };
  }

  componentWillUpdate(nextProps) {
    if(this.props.namespace != nextProps.namespace) {
      k8sApi.listNamespacedPod(nextProps.namespace).then(response => {
        this.setState({ pods: response.body.items });
      });
    }
  }

  render() {
    return <PodsComponent pods={this.state.pods} />;
  }
}

Pods.propTypes = {
  namespace: propTypes.string
};

module.exports = Pods;