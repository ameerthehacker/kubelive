const React = require('react');
const { Component } = require('react');
const { Color, Box } = require('ink');
const PropTypes = require('prop-types');

class ActionBar extends Component  {
  constructor(props) {
    super(props);
    this.keyPressListeners = [];
  }

  getAvailableActions() {
    let availableActions = '';

    this.props.actions.forEach(action => {
      availableActions += `[${action.key.toUpperCase()}]: ${action.description} `;
    });

    return availableActions;
  }

  createkeyPressListener(action) {
    return (chunk, key) => {
      if(key.name == action.key) {
        this.props.onActionPerformed(key);
      }
    }
  };

  componentDidMount() {
    this.props.actions.forEach(action => {
      const keyPressListener = this.createkeyPressListener(action);

      this.keyPressListeners.push(keyPressListener);
      process.stdin.on('keypress', keyPressListener);
    });
  }

  componentWillUnmount() {
    // Remove all listeners added by this component
    this.keyPressListeners.forEach(keyPressListener => {
      process.stdin.removeListener('keypress', keyPressListener);
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