'use strict';
const React = require('react');
const { Component } = require('react');
const importJsx = require('import-jsx');
const Namespaces = importJsx('../containers/namespaces');
const Pods = importJsx('../containers/pods');
const { render } = require('ink');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedNamespace: '' };
    this.onNamespaceChange = this.onNamespaceChange.bind(this);
  }

  onNamespaceChange(name) {
    this.setState({ selectedNamespace: name });
  }

  render() {
    return (
      <React.Fragment>
        <Namespaces onNamespaceChange={this.onNamespaceChange} />
        <Pods namespace={this.state.selectedNamespace} />
      </React.Fragment>
    );
  }
}

render(<App />);
