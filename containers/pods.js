'use strict';
const k8sApi = require('../kube/api');
const React = require('react');
const importJsx = require('import-jsx');
const PodsComponent = importJsx('../components/pods');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { Color } = require('ink');
const { transformPodData } = require('../transformers/pod');

class Pods extends Component {
  constructor(props) {
    super(props);
    this.state = { pods: [], err: '' };
    this.timer;
    this.willComponentUnmount = false;
  }

  setStateSefely(state) {
    if (!this.willComponentUnmount) {
      this.setState(state);
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.namespace != prevProps.namespace && !this.state.err) {
      this.listenForChanges(this.props.namespace);
    }

    return null;
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.willComponentUnmount = true;
  }

  listenForChanges(namespace) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      k8sApi
        .listNamespacedPod(namespace)
        .then((response) => {
          this.setStateSefely({ pods: transformPodData(response.body.items) });
        })
        .catch((err) => {
          this.setStateSefely({ ...this.state, err: err.code });
        });
    }, 1000);
  }

  render() {
    if (!this.state.err) {
      return (
        <PodsComponent
          pods={this.state.pods}
          namespace={this.props.namespace}
        />
      );
    } else {
      return (
        <Color red>
          Unable to connect to the kube cluster: {this.state.err}
        </Color>
      );
    }
  }
}

Pods.propTypes = {
  namespace: PropTypes.string.isRequired
};

module.exports = Pods;
