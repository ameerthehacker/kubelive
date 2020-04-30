'use strict';
const React = require('react');
const { Component } = require('react');
const importJsx = require('import-jsx');
const Namespaces = importJsx('./namespaces');
const Pods = importJsx('./pods');
const Services = importJsx('./services');
const ReplicationController = importJsx('./replication-controllers');
const Nodes = importJsx('./nodes');
const { Color } = require('ink');
const { StdinContext } = require('ink');
const PropTypes = require('prop-types');

class App extends Component {
  constructor(props) {
    super(props);
    this.isNamespaced = true;
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
      case 'po':
        return Pods;
      case 'service':
      case 'svc':
      case 'services':
        return Services;
      case 'replicationcontroller':
      case 'replicationcontrollers':
      case 'rc':
        return ReplicationController;
      case 'node':
      case 'nodes':
      case 'no':
        this.isNamespaced = false;
        return Nodes;
      default:
        return false;
    }
  }

  render() {
    const ResourceComponent = this.getResourceComponent();

    if (ResourceComponent) {
      return (
        <React.Fragment>
          {this.isNamespaced ? (
            <Namespaces onNamespaceChange={this.onNamespaceChange} />
          ) : null}
          <StdinContext.Consumer>
            {({ stdin, setRawMode }) => (
              <ResourceComponent
                namespace={this.state.selectedNamespace}
                stdin={stdin}
                setRawMode={setRawMode}
              />
            )}
          </StdinContext.Consumer>
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
