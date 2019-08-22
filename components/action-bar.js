const React = require('react');
const { Component } = require('react');
const { Color, Box } = require('ink');
const PropTypes = require('prop-types');

class ActionBar extends Component  {
  constructor(props) {
    super(props);
  }

  getAvailableActions() {
    let availableActions = '';

    this.props.actions.forEach(action => {
      availableActions += `[${action.key.toUpperCase()}]: ${action.description} `;
    });

    return availableActions;
  }

  componentDidMount() {
    this.props.actions.forEach(action => {
      process.stdin.on('keypress', (chunk, key) => {
        if(action.key == key.name) {
          this.props.onActionPerformed(key);
        }
      });
    });
  }

  render() {
    if(this.props.actions.length > 0) {
      return <Box marginTop={1} marginBottom={1} width="100%">
        <Color yellow>{this.getAvailableActions()}</Color>
      </Box>;
    }
    else {
      return '';
    }
  }
};

ActionBar.propTypes = {
  actions: PropTypes.array.isRequired,
  onActionPerformed: PropTypes.func.isRequired
}

module.exports = ActionBar;