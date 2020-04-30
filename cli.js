'use strict';
const React = require('react');
const { setCurrentCXT } = require('./src/utils/utils');
const importJsx = require('import-jsx');
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

cli.version(pkg.version, '-v, --version');
cli
  .command('get <resource>')
  .option('--context <name>', 'set kubernetes context to use')
  .description('get live update on the <resource>')
  .action((resource, args) => {
    commandMatched = true;
    if (args.context) {
      setCurrentCXT(args.context);
    }

    const App = importJsx('./src/containers/app');

    render(<App resource={resource} />);
  });

cli.parse(process.argv);

// hack to render default resource if nothing was given
if (process.argv.length === 2) {
  commandMatched = true;
  const App = importJsx('./src/containers/app');

  render(<App resource={defaultResource} />);
}

if (!commandMatched) {
  cli.help();
}
