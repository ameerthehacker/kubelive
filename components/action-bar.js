const React = require('react');
const { Component } = require('react');
const { Color, Box } = require('ink');
const PropTypes = require('prop-types');

class ActionBarComponent extends Component {
  constructor(props) {
    super(props);
    this.keyPressListeners = [];
    this.state = { waitingForConfirmation: false };
  }

  getAvailableActions() {
    let availableActions = '';

    this.props.actions.forEach((action) => {
      availableActions += `[${action.key.toUpperCase()}]: ${
        action.description
      } `;
    });

    return availableActions;
  }

  createKeyPressListener(action) {
    return (chunk, key) => {
      if (key.name == action.key && action.needsConfirmation) {
        this.setState({
          ...this.state,
          waitingForConfirmation: {
            key
          }
        });
      } else if (key.name == action.key && !this.state.waitingForConfirmation) {
        this.props.onActionPerformed(key);
      } else if (this.state.waitingForConfirmation) {
        if (key.name == 'y') {
          this.props.onActionPerformed(this.state.waitingForConfirmation.key);
          this.setState({
            ...this.state,
            waitingForConfirmation: false
          });
        } else if (key.name == 'n') {
          this.setState({
            ...this.state,
            waitingForConfirmation: false
          });
        }
      }
    };
  }

  componentDidMount() {
    this.props.actions.forEach((action) => {
      const keyPressListener = this.createKeyPressListener(action);

      this.keyPressListeners.push(keyPressListener);
      process.stdin.on('keypress', keyPressListener);
    });
  }

  componentWillUnmount() {
    // Remove all listeners added by this component
    this.keyPressListeners.forEach((keyPressListener) => {
      process.stdin.removeListener('keypress', keyPressListener);
    });
  }

  render() {
    if (this.props.actions.length > 0) {
      return (
        <Box marginTop={1} marginBottom={1}>
          <Color yellow>
            {this.state.waitingForConfirmation
              ? 'Are you sure [Y/N]:'
              : this.getAvailableActions()}
          </Color>
        </Box>
      );
    } else {
      return '';
    }
  }
}

ActionBarComponent.propTypes = {
  actions: PropTypes.array.isRequired,
  onActionPerformed: PropTypes.func.isRequired
};

module.exports = ActionBarComponent;
