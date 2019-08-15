const React = require('react');
const importJsx = require('import-jsx');
const Namespaces = importJsx('../containers/namespaces');
const { render } = require('ink');

const App = () => {
  return (
    <Namespaces />
  )
}

render(<App />);