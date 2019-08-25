const importJsx = require('import-jsx');
const ActionBarComponent = importJsx('../../components/action-bar');

describe('ActionBarComponent', () => {
  let actionBarComponent;
  const actions = [
    {
      key: 'd',
      description: 'Delete',
      needsConfirmation: true
    },
    {
      key: 'c',
      description: 'Copy'
    }
  ];

  beforeEach(() => {
    actionBarComponent = new ActionBarComponent({
      actions,
      onActionPerformed: jest.fn()
    });
    actionBarComponent.setState = jest.fn();
  });

  describe('getAvailableActions()', () => {
    it('should return the available actions in the correct format', () => {
      const availableActionsFormat = `[${actions[0].key.toUpperCase()}]: ${
        actions[0].description
      } [${actions[1].key.toUpperCase()}]: ${actions[1].description} `;

      const availableActions = actionBarComponent.getAvailableActions();

      expect(availableActions).toEqual(availableActionsFormat);
    });
  });

  describe('createKeyPressListener()', () => {
    it('should return a function', () => {
      const keyPressListener = actionBarComponent.createKeyPressListener(
        actions[0]
      );

      expect(typeof keyPressListener).toEqual('function');
    });

    it('sets waitingForConfirmation when the action needsConfirmation', () => {
      const keyPressListener = actionBarComponent.createKeyPressListener(
        actions[0]
      );

      keyPressListener(undefined, { name: actions[0].key });

      expect(actionBarComponent.setState).toHaveBeenCalledWith({
        ...actionBarComponent.state,
        waitingForConfirmation: {
          key: {
            name: actions[0].key
          }
        }
      });
    });

    it('returned function should call onActionPerformed(key) when it is not waiting for confirmation', () => {
      const keyPressListener = actionBarComponent.createKeyPressListener(
        actions[1]
      );
      const onActionPerformedMock = jest.fn();
      actionBarComponent.props.onActionPerformed = onActionPerformedMock;

      keyPressListener(undefined, { name: actions[1].key });

      expect(onActionPerformedMock).toHaveBeenCalledWith({
        name: actions[1].key
      });
    });

    it('should call onActionPerformed(key) when y is pressed while waiting for confirmation', () => {
      const keyPressListener = actionBarComponent.createKeyPressListener(
        actions[0]
      );
      const onActionPerformedMock = jest.fn();
      actionBarComponent.props.onActionPerformed = onActionPerformedMock;
      actionBarComponent.state = {
        ...actionBarComponent.state,
        waitingForConfirmation: { key: { name: actions[0].key } }
      };

      keyPressListener(undefined, { name: 'y' });

      expect(onActionPerformedMock).toHaveBeenCalledWith({
        name: actions[0].key
      });
    });

    it('should call setState({ waitigForConfirmation: false }) when y is pressed while waiting for confirmation', () => {
      const keyPressListener = actionBarComponent.createKeyPressListener(
        actions[0]
      );
      actionBarComponent.state = {
        ...actionBarComponent.state,
        waitingForConfirmation: { key: { name: actions[0].key } }
      };

      keyPressListener(undefined, { name: 'y' });

      expect(actionBarComponent.setState).toHaveBeenCalledWith({
        waitingForConfirmation: false
      });
    });

    it('should call setState({ waitigForConfirmation: false }) when n is pressed while waiting for confirmation', () => {
      const keyPressListener = actionBarComponent.createKeyPressListener(
        actions[0]
      );
      actionBarComponent.state = {
        ...actionBarComponent.state,
        waitingForConfirmation: { key: { name: actions[0].key } }
      };

      keyPressListener(undefined, { name: 'n' });

      expect(actionBarComponent.setState).toHaveBeenCalledWith({
        waitingForConfirmation: false
      });
    });
  });

  describe('componentDidMount()', () => {
    it('should create keyPress listener for each action', () => {
      actionBarComponent.componentDidMount();

      expect(actionBarComponent.keyPressListeners.length).toEqual(
        actions.length
      );
    });

    it('should call createKeyPressListener(action) with every action', () => {
      // Arrange
      const createKeyPressListenerMock = jest.fn().mockReturnValue(() => {});
      actionBarComponent.createKeyPressListener = createKeyPressListenerMock;
      const args = [];

      actions.forEach((action) => {
        args.push([action]);
      });

      // Act
      actionBarComponent.componentDidMount();

      // Assert
      expect(createKeyPressListenerMock.mock.calls).toEqual(args);
    });

    it('should call process.stdin.on(keypress, listener)', () => {
      // Arrange
      const keyPressListeners = [() => 'listener1', () => 'listener2'];
      const createKeyPressListenerMock = jest
        .fn()
        .mockReturnValue(keyPressListeners[1])
        .mockReturnValueOnce(keyPressListeners[0]);
      actionBarComponent.createKeyPressListener = createKeyPressListenerMock;
      process.stdin.on = jest.fn();
      const args = [];

      actions.forEach((action, index) => {
        args.push(['keypress', keyPressListeners[index]]);
      });

      // Act
      actionBarComponent.componentDidMount();

      // Assert
      expect(process.stdin.on.mock.calls).toEqual(args);
    });
  });

  describe('componentWillUnmount()', () => {
    it('should remove all the keyPressListeners while unmounting', () => {
      // Arrange
      const keyPressListeners = [() => 'listener1', () => 'listener2'];
      const createKeyPressListenerMock = jest
        .fn()
        .mockReturnValue(keyPressListeners[1])
        .mockReturnValueOnce(keyPressListeners[0]);
      actionBarComponent.createKeyPressListener = createKeyPressListenerMock;
      process.stdin.removeListener = jest.fn();
      const args = [];

      actions.forEach((action, index) => {
        args.push(['keypress', keyPressListeners[index]]);
      });

      // Act
      actionBarComponent.componentDidMount();
      actionBarComponent.componentWillUnmount();

      // Assert
      expect(process.stdin.removeListener.mock.calls).toEqual(args);
    });
  });
});
