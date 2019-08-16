const k8sApi = require('../kube-api');
const React = require('react');
const importJsx = require('import-jsx');
const NamespacesComponent = importJsx('../components/namespaces');
const { Component } = require('react');

class Namespaces extends Component {
  constructor(props) {
    super(props);
    this.state = { namespaces: [] };
  }

  componentDidMount() {
    k8sApi.listNamespace().then(response => {
      this.setState({ namespaces: response.body.items });
    });
  }

  render() {
    return <NamespacesComponent namespaces={this.state.namespaces} />;
  }
}

module.exports = Namespaces;