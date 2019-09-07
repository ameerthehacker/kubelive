'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const App = importJsx('./containers/app');
const { render } = require('ink');
const cli = require('commander');
const version = require('./package.json').version;
const defaultResource = 'pods';
let commandMatched = false;

// hack to render default resource if nothing was given
if (process.argv.length == 2) {
  commandMatched = true;
  render(<App resource={defaultResource} />);
}

cli.version(version, '-v, --version');

cli
  .command('get <resource>')
  .description('get live update on the <resource>')
  .action((resource) => {
    commandMatched = true;
    render(<App resource={resource} />);
  });

cli.parse(process.argv);

if (!commandMatched) {
  cli.help();
}
