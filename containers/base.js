'use strict';
const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { Color } = require('ink');

class BaseContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], err: '' };
    this.timer;
    this.willComponentUnmount = false;

    // For resources which are not bound by namespaces eg: nodes
    if (!this.props.isNamespaced) {
      this.listenForChanges();
    }
  }

  setStateSafely(state) {
    if (!this.willComponentUnmount) {
      this.setState(state);
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (
      this.props.isNamespaced &&
      this.props.namespace != prevProps.namespace &&
      !this.state.err
    ) {
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
      this.props.api[this.props.refreshFn](namespace)
        .then((response) => {
          this.setStateSafely({
            items: this.props.transformer(response.body.items)
          });
        })
        .catch((err) => {
          this.setStateSafely({ ...this.state, err: err.code });
        });
    }, this.props.refreshInterval || 1000);
  }

  render() {
    if (!this.state.err) {
      return (
        <this.props.componentRef
          items={this.state.items}
          namespace={this.props.namespace}
          stdin={this.props.stdin}
          setRawMode={this.props.setRawMode}
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

BaseContainer.propTypes = {
  namespace: PropTypes.string,
  transformer: PropTypes.func,
  componentRef: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
  refreshFn: PropTypes.string.isRequired,
  refreshInterval: PropTypes.number,
  isNamespaced: PropTypes.bool,
  stdin: PropTypes.object.isRequired,
  setRawMode: PropTypes.func.isRequired
};

module.exports = BaseContainer;
