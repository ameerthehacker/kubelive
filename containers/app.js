'use strict';
const React = require('react');
const { Component } = require('react');
const importJsx = require('import-jsx');
const Namespaces = importJsx('./namespaces');
const Pods = importJsx('./pods');
const Services = importJsx('./services');
const PropTypes = require('prop-types');
const { Color } = require('ink');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedNamespace: '' };
    this.onNamespaceChange = this.onNamespaceChange.bind(this);
  }

  onNamespaceChange(name) {
    this.setState({ selectedNamespace: name });
  }

  getResourceComponent() {
    switch (this.props.resource) {
      case 'pod':
      case 'pods':
        return <Pods namespace={this.state.selectedNamespace} />;
      case 'service':
      case 'services':
        return <Services namespace={this.state.selectedNamespace} />;
      default:
        return false;
    }
  }

  render() {
    const resourceComponent = this.getResourceComponent();

    if (resourceComponent) {
      return (
        <React.Fragment>
          <Namespaces onNamespaceChange={this.onNamespaceChange} />
          {resourceComponent}
        </React.Fragment>
      );
    } else {
      return <Color red>resource {this.props.resource} is not supported</Color>;
    }
  }
}

App.propTypes = {
  resource: PropTypes.string.isRequired
};

module.exports = App;
