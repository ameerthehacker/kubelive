'use strict';
const k8sApi = require('../kube/api');
const React = require('react');
const importJsx = require('import-jsx');
const NodesComponent = importJsx('../components/nodes');
const BaseContainer = importJsx('./base');
const { Component } = require('react');
const { transformNodeData } = require('../transformers/node');
const PropTypes = require('prop-types');

class Nodes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseContainer
        transformer={transformNodeData}
        api={k8sApi}
        refreshFn="listNode"
        componentRef={NodesComponent}
        isNamespaced={false}
        stdin={this.props.stdin}
        setRawMode={this.props.setRawMode}
      />
    );
  }
}

Nodes.propTypes = {
  stdin: PropTypes.object.isRequired,
  setRawMode: PropTypes.func.isRequired
};

module.exports = Nodes;
