'use strict';
const k8sApi = require('../kube/api');
const React = require('react');
const importJsx = require('import-jsx');
const PodsComponent = importJsx('../components/pods');
const BaseContainer = importJsx('./base');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { transformPodData } = require('../transformers/pod');

class Pods extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseContainer
        namespace={this.props.namespace}
        transformer={transformPodData}
        api={k8sApi}
        refreshFn="listNamespacedPod"
        componentRef={PodsComponent}
      />
    );
  }
}

Pods.propTypes = {
  namespace: PropTypes.string.isRequired
};

module.exports = Pods;
