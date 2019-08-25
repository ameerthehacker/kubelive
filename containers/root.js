'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const App = importJsx('./app');
const { render } = require('ink');

render(<App />);
