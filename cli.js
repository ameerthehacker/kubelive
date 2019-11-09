'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const App = importJsx('./src/containers/app');
const { render } = require('ink');
const cli = require('commander');
const pkg = require('./package.json');
const defaultResource = 'pods';
let commandMatched = false;
const updateNotifier = require('update-notifier');

// Checking for available updates
const notifier = updateNotifier({ pkg, isGlobal: true });
// Show update notification
notifier.notify();

// hack to render default resource if nothing was given
if (process.argv.length == 2) {
  commandMatched = true;
  render(<App resource={defaultResource} />);
}

cli.version(pkg.version, '-v, --version');

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
