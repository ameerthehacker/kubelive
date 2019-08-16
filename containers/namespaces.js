const k8sApi = require('../kube-api');
const React = require('react');
const importJsx = require('import-jsx');
const NamespacesComponent = importJsx('../components/namespaces');
const { Component } = require('react');
const propTypes = require('prop-types');

class Namespaces extends Component {
  constructor(props) {
    super(props);
    this.state = { namespaces: [] };
  }

  componentDidMount() {
    k8sApi.listNamespace().then(response => {
      const namespaces = response.body.items;

      this.setState({ namespaces: namespaces });
      
      // Trigger a first available namespace
      if(namespaces.length > 0) {
        this.props.onNamespaceChange(namespaces[0].metadata.name);
      }
    });
  }

  render() {
    return <NamespacesComponent onNamespaceChange={this.props.onNamespaceChange} namespaces={this.state.namespaces} />;
  }
}

Namespaces.propTypes = {
  onNamespaceChange: propTypes.func  
}

module.exports = Namespaces;