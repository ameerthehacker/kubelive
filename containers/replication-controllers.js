'use strict';
const k8sApi = require('../kube/api');
const React = require('react');
const importJsx = require('import-jsx');
const ReplicationControllersComponent = importJsx(
  '../components/replication-controllers'
);
const BaseContainer = importJsx('./base');
const { Component } = require('react');
const PropTypes = require('prop-types');
const {
  transformReplicationControllerData
} = require('../transformers/replication-controller');

class ReplicationControllers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseContainer
        namespace={this.props.namespace}
        transformer={transformReplicationControllerData}
        api={k8sApi}
        refreshFn="listNamespacedReplicationController"
        componentRef={ReplicationControllersComponent}
      />
    );
  }
}

ReplicationControllers.propTypes = {
  namespace: PropTypes.string.isRequired
};

module.exports = ReplicationControllers;
