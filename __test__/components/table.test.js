const React = require('react');
const importJsx = require('import-jsx');
const TableComponent = importJsx('../../components/table');
const { Color } = require('ink');

describe('Table', () => {
  const createTableComponent = (props = { data: [] }) => {
    const tableComponent = new TableComponent(props);
    tableComponent.setState = jest.fn();

    return tableComponent;
  };

  describe('componentDidMount()', () => {
    it('should respond to up key only when there is data', () => {
      const tableComponent = createTableComponent();
      process.stdin.on = jest.fn().mockImplementation((event, fn) => {
        fn(undefined, { name: 'up' });
      });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should respond to down key only when there is data', () => {
      const tableComponent = createTableComponent();
      process.stdin.on = jest.fn().mockImplementation((event, fn) => {
        fn(undefined, { name: 'down' });
      });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should increase selected index when down key is pressed', () => {
      const tableComponent = createTableComponent({
        data: [
          {
            name: 'Ameer'
          },
          {
            name: 'Jhan'
          }
        ]
      });
      tableComponent.state.selectedIndex = 0;
      process.stdin.on = jest.fn().mockImplementation((event, fn) => {
        fn(undefined, { name: 'down' });
      });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).toHaveBeenCalledWith({
        ...tableComponent.state,
        selectedIndex: tableComponent.state.selectedIndex + 1
      });
    });

    it('should set selected index to 0 when selected index is maximum and down key is pressed', () => {
      const data = [
        {
          name: 'Ameer'
        },
        {
          name: 'Jhan'
        }
      ];
      const tableComponent = createTableComponent({
        data
      });
      tableComponent.state.selectedIndex = data.length - 1;
      process.stdin.on = jest.fn().mockImplementation((event, fn) => {
        fn(undefined, { name: 'down' });
      });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).toHaveBeenCalledWith({
        ...tableComponent.state,
        selectedIndex: 0
      });
    });

    it('should decrease selected index when up key is pressed', () => {
      const data = [
        {
          name: 'Ameer'
        },
        {
          name: 'Jhan'
        }
      ];
      const tableComponent = createTableComponent({
        data
      });
      tableComponent.state.selectedIndex = data.length - 1;
      process.stdin.on = jest.fn().mockImplementation((event, fn) => {
        fn(undefined, { name: 'up' });
      });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).toHaveBeenCalledWith({
        ...tableComponent.state,
        selectedIndex: tableComponent.state.selectedIndex - 1
      });
    });

    it('should set selected index to max when selected index is 0 and up key is pressed', () => {
      const data = [
        {
          name: 'Ameer'
        },
        {
          name: 'Jhan'
        }
      ];
      const tableComponent = createTableComponent({
        data
      });
      tableComponent.state.selectedIndex = 0;
      process.stdin.on = jest.fn().mockImplementation((event, fn) => {
        fn(undefined, { name: 'up' });
      });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).toHaveBeenCalledWith({
        ...tableComponent.state,
        selectedIndex: data.length - 1
      });
    });
  });

  describe('getSnapshotBeforeUpdate()', () => {
    it('should call setState only when there is a change in namespace', () => {
      const namespace = 'some-namespace';
      const tableComponent = createTableComponent({
        data: [],
        namespace
      });

      tableComponent.getSnapshotBeforeUpdate({ namespace });

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should set selected index to 0 when there is a change in namespace', () => {
      const tableComponent = createTableComponent({
        data: [],
        namespace: 'some-namespace'
      });

      tableComponent.getSnapshotBeforeUpdate({
        namespace: 'some-other-namespace'
      });

      expect(tableComponent.setState.mock.calls[0]).toEqual([
        {
          ...tableComponent.state,
          selectedIndex: 0
        }
      ]);
    });

    it('should adjust selected index only if the new data array is lengthier than selected index', () => {
      const tableComponent = createTableComponent({
        data: [
          {
            name: 'khan'
          },
          {
            name: 'jhan'
          }
        ],
        namespace: 'some-namespace'
      });

      tableComponent.state.selectedIndex = 2;
      tableComponent.getSnapshotBeforeUpdate({
        namespace: 'some-other-namespace',
        data: [
          {
            name: 'khan'
          },
          {
            name: 'jhan'
          },
          {
            name: 'bala'
          }
        ]
      });

      expect(tableComponent.setState.mock.calls[1]).toEqual([
        {
          ...tableComponent.state,
          selectedIndex: 0
        }
      ]);
    });
  });

  describe('findMaxLengthText()', () => {
    it('should return the max length of string under each header', () => {
      const tableComponent = createTableComponent();
      const longestText = 'shanmugam';
      const array = [
        { name: { text: longestText } },
        { name: { text: longestText.substr(0, longestText.length - 1) } },
        { name: { text: longestText.substr(0, longestText.length - 2) } }
      ];

      const result = tableComponent.findMaxLengthText(array, 'name');

      expect(result).toEqual(longestText.length);
    });

    it('should length of the header if it is the lengthiest', () => {
      const tableComponent = createTableComponent();
      const text = 'shanmugam';
      const longestTextHeader = text + '-some-header';
      const array = [
        { [longestTextHeader]: { text: text } },
        { [longestTextHeader]: { text: text.substr(0, text.length - 1) } },
        { [longestTextHeader]: { text: text.substr(0, text.length - 2) } }
      ];

      const result = tableComponent.findMaxLengthText(array, longestTextHeader);

      expect(result).toEqual(longestTextHeader.length);
    });
  });

  describe('colorizeText()', () => {
    it('should return content.text when there is no bgColor and color', () => {
      const tableComponent = createTableComponent();
      const content = { text: 'something' };

      const result = tableComponent.colorizeText(content);

      expect(result).toEqual(content.text);
    });

    it('should return Color component with specified bgColor', () => {
      const tableComponent = createTableComponent();
      const content = { text: 'something', bgColor: 'red' };

      const result = tableComponent.colorizeText(content);

      const props = { bgKeyword: content.bgColor };
      expect(result).toEqual(<Color {...props}>{content.text}</Color>);
    });

    it('should return Color component with specified color', () => {
      const tableComponent = createTableComponent();
      const content = { text: 'something', color: 'red' };

      const result = tableComponent.colorizeText(content);

      const props = { [content.color]: true };
      expect(result).toEqual(<Color {...props}>{content.text}</Color>);
    });
  });

  describe('padAroundStringWithSpaces()', () => {
    it('should not add any spaces if the noOfSpaces == string length', () => {
      const tableComponent = createTableComponent();
      const text = 'something';
      const noOfSpaces = text.length;

      const result = tableComponent.padAroundStringWithSpaces(text, noOfSpaces);

      expect(result).toEqual(text);
    });

    it('should pad spaces / 2 at both ends if the noOfSpaces - text.length is divisible by 2', () => {
      const tableComponent = createTableComponent();
      const text = 'something';
      const noOfSpaces = text.length + 2;

      const result = tableComponent.padAroundStringWithSpaces(text, noOfSpaces);

      expect(result).toEqual(' ' + text + ' ');
    });

    it('should pad spaces / 2 + 1 at the ends if the noOfSpaces - text.length is not divisible by 2', () => {
      const tableComponent = createTableComponent();
      const text = 'something';
      const noOfSpaces = text.length + 3;

      const result = tableComponent.padAroundStringWithSpaces(text, noOfSpaces);

      expect(result).toEqual(' ' + text + '  ');
    });

    it('should pad extra spaces at both ends', () => {
      const tableComponent = createTableComponent();
      const text = 'something';
      const noOfSpaces = text.length;

      const result = tableComponent.padAroundStringWithSpaces(
        text,
        noOfSpaces,
        1
      );

      expect(result).toEqual(' ' + text + ' ');
    });
  });
});
