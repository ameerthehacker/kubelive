'use strict';
const k8sApi = require('../kube/api');
const React = require('react');
const importJsx = require('import-jsx');
const ServicesComponent = importJsx('../components/services');
const BaseContainer = importJsx('./base');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { transformServiceData } = require('../transformers/services');

class Pods extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseContainer
        namespace={this.props.namespace}
        transformer={transformServiceData}
        api={k8sApi}
        refreshFn="listNamespacedService"
        componentRef={ServicesComponent}
      />
    );
  }
}

Pods.propTypes = {
  namespace: PropTypes.string.isRequired
};

module.exports = Pods;
