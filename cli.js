'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const App = importJsx('./containers/app');
const { render } = require('ink');
const cli = require('commander');
const version = require('./package.json').version;

cli.version(version, '-v, --version');

cli
  .command('get <resource>')
  .description('get live update on the <resource>')
  .action((resource) => {
    render(<App resource={resource} />);
  });

cli.parse(process.argv);
