const React = require('react');
const importJsx = require('import-jsx');
const { TableComponent, SelectionHighlighterComponent } = importJsx(
  '../../src/components/table'
);
const ActionBarComponent = importJsx('../../src/components/action-bar');
const { Color, Box } = require('ink');
const { shallow } = require('enzyme');

describe('Table', () => {
  const createTableComponent = (
    props = {
      data: [],
      namespace: 'some-namespace',
      stdin: { on: () => {} },
      setRawMode: () => {}
    }
  ) => {
    const tableComponent = new TableComponent(props);
    tableComponent.setState = jest.fn();

    return tableComponent;
  };

  describe('componentDidMount()', () => {
    it('should respond to up key only when there is data', () => {
      const tableComponent = createTableComponent();
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
          fn(undefined, { name: 'up' });
        });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should respond to down key only when there is data', () => {
      const tableComponent = createTableComponent();
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
          fn(undefined, { name: 'down' });
        });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should not respond to up key only when the data is undefined', () => {
      const tableComponent = createTableComponent({
        data: undefined,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });

      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
          fn(undefined, { name: 'up' });
        });

      tableComponent.componentDidMount();

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should not respond to down key only when the data is undefined', () => {
      const tableComponent = createTableComponent({
        data: undefined,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
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
        ],
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      tableComponent.state.selectedIndex = 0;
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
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
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      tableComponent.state.selectedIndex = data.length - 1;
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
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
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      tableComponent.state.selectedIndex = data.length - 1;
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
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
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      tableComponent.state.selectedIndex = 0;
      tableComponent.props.stdin.on = jest
        .fn()
        .mockImplementation((event, fn) => {
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
        namespace,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });

      tableComponent.getSnapshotBeforeUpdate({ namespace });

      expect(tableComponent.setState).not.toHaveBeenCalled();
    });

    it('should set selected index to 0 when there is a change in namespace', () => {
      const tableComponent = createTableComponent({
        data: [],
        namespace: 'some-namespace',
        stdin: { on: () => {} },
        setRawMode: () => {}
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
        namespace: 'some-namespace',
        stdin: { on: () => {} },
        setRawMode: () => {}
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

  describe('padAroundTableValues', () => {
    it('should pad extra space to match max length text', () => {
      const tableComponent = createTableComponent();
      const data = [
        {
          name: { text: 'Zauba', padText: true, extraPadding: 1 }
        },
        {
          name: { text: 'Sam', padText: true, extraPadding: 1 }
        }
      ];
      const result = tableComponent.padAroundTableValues(data, {
        name: 5
      });
      const expectedResult = [
        {
          name: { text: ' Zauba ', padText: true, extraPadding: 1 }
        },
        {
          name: { text: '  Sam  ', padText: true, extraPadding: 1 }
        }
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTableHeaderTexts()', () => {
    it('should return the table headers', () => {
      const tableComponent = createTableComponent();
      const result = tableComponent.getTableHeaderTexts([
        {
          name: 'Ameer',
          age: 18
        }
      ]);

      expect(result).toEqual(['name', 'age']);
    });
  });

  describe('getMaxLengthOfTextInHeaders()', () => {
    it('should return the table headers', () => {
      const tableComponent = createTableComponent();
      const longName = 'Shanmugam';
      const longAge = '100';
      const result = tableComponent.getMaxLengthOfTextInHeaders([
        {
          name: { text: 'Ameer' },
          age: { text: 18 }
        },
        {
          name: { text: longName },
          age: { text: longAge }
        }
      ]);

      expect(result).toEqual({
        name: longName.length,
        age: longAge.length
      });
    });
  });

  describe('getTableHeader()', () => {
    it('should return the table headers with correct width', () => {
      const tableComponent = createTableComponent();
      const longName = 'Shanmugam';
      const longAge = '100';
      const cellSpacing = 5;
      const tableHeader = tableComponent.getTableHeader(
        [
          {
            name: { text: 'Ameer' },
            age: { text: 18 }
          },
          {
            name: { text: longName },
            age: { text: longAge }
          }
        ],
        {
          name: longName.length,
          age: longAge.length
        },
        cellSpacing
      );

      const nameHeader = shallow(tableHeader[0]);
      const ageHeader = shallow(tableHeader[1]);

      expect(nameHeader.instance().props.width).toEqual(
        longName.length + cellSpacing
      );
      expect(ageHeader.instance().props.width).toEqual(
        longAge.length + cellSpacing
      );
    });

    it('should render the text in green color', () => {
      const tableComponent = createTableComponent();
      const longName = 'Shanmugam';
      const cellSpacing = 5;
      const tableHeader = tableComponent.getTableHeader(
        [
          {
            name: { text: longName }
          }
        ],
        cellSpacing
      );

      const nameHeader = shallow(tableHeader[0]);
      const colorComponent = nameHeader.find(Color).first();

      expect(colorComponent.props().green).toBeTruthy();
    });

    it('should render the text inside the color component', () => {
      const tableComponent = createTableComponent();
      const longName = 'Shanmugam';
      const cellSpacing = 5;
      const tableHeader = tableComponent.getTableHeader(
        [
          {
            name: { text: longName }
          }
        ],
        cellSpacing
      );

      const nameHeader = shallow(tableHeader[0]);
      const colorComponent = nameHeader.find(Color).first();

      expect(colorComponent.childAt(0).text()).toEqual('NAME');
    });
  });

  describe('getTableContent()', () => {
    it('should render the data in with proper width', () => {
      const data = [
        {
          name: { text: 'Ameer' },
          age: { text: 22 }
        }
      ];
      const tableComponent = createTableComponent({
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      const cellSpacing = 5;
      const maxLengthOfTextInHeader = tableComponent.getMaxLengthOfTextInHeaders(
        data
      );

      const tableContent = tableComponent.getTableContent(
        data,
        maxLengthOfTextInHeader,
        cellSpacing
      );

      const tableRow = shallow(tableContent[0]);
      const nameRow = tableRow.find(Box).first();
      const ageRow = tableRow.find(Box).last();
      expect(nameRow.props().width).toEqual(
        maxLengthOfTextInHeader['name'] + cellSpacing
      );
      expect(ageRow.props().width).toEqual(
        maxLengthOfTextInHeader['age'] + cellSpacing
      );
    });

    it('should highlight the selected text', () => {
      const selectedText = 'Shanmugam';
      const data = [
        {
          name: { text: 'Ameer', isSelector: true },
          age: { text: 22 }
        },
        {
          name: { text: selectedText, isSelector: true },
          age: { text: 22 }
        }
      ];
      const tableComponent = createTableComponent({
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      const cellSpacing = 5;
      const maxLengthOfTextInHeader = tableComponent.getMaxLengthOfTextInHeaders(
        data
      );
      tableComponent.state.selectedIndex = 1;

      const tableContent = tableComponent.getTableContent(
        data,
        maxLengthOfTextInHeader,
        cellSpacing
      );

      const tableRow = shallow(tableContent[1]);
      const nameRow = tableRow.find(Box).first();
      const highlighterComponent = nameRow.find(SelectionHighlighterComponent);
      expect(highlighterComponent.props().isSelected).toBeTruthy();
    });

    it('should set highlight text to the selected text', () => {
      const selectedText = 'Shanmugam';
      const data = [
        {
          name: { text: 'Ameer', isSelector: true },
          age: { text: 22 }
        },
        {
          name: { text: selectedText, isSelector: true },
          age: { text: 22 }
        }
      ];
      const tableComponent = createTableComponent({
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      const cellSpacing = 5;
      const maxLengthOfTextInHeader = tableComponent.getMaxLengthOfTextInHeaders(
        data
      );
      tableComponent.state.selectedIndex = 1;

      const tableContent = tableComponent.getTableContent(
        data,
        maxLengthOfTextInHeader,
        cellSpacing
      );

      const tableRow = shallow(tableContent[1]);
      const nameRow = tableRow.find(Box).first();
      const highlighterComponent = nameRow.find(SelectionHighlighterComponent);
      expect(highlighterComponent.props().content).toEqual(selectedText);
    });

    it('should set this.selectedText to the selected text', () => {
      const selectedText = 'Shanmugam';
      const data = [
        {
          name: { text: 'Ameer', isSelector: true },
          age: { text: 22 }
        },
        {
          name: { text: selectedText, isSelector: true },
          age: { text: 22 }
        }
      ];
      const tableComponent = createTableComponent({
        data,
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      const cellSpacing = 5;
      const maxLengthOfTextInHeader = tableComponent.getMaxLengthOfTextInHeaders(
        data
      );
      tableComponent.state.selectedIndex = 1;

      tableComponent.getTableContent(
        data,
        maxLengthOfTextInHeader,
        cellSpacing
      );

      expect(tableComponent.selectedText).toEqual(selectedText);
    });
  });

  describe('emptySpaces()', () => {
    it('should return specified number of empty spaces', () => {
      const tableComponent = createTableComponent();

      expect(tableComponent.emptySpaces(2)).toEqual('  ');
    });
  });
});

describe('Table', () => {
  const createTableComponent = (
    props = {
      data: [],
      namespace: 'some-namespace',
      stdin: { on: () => {} },
      setRawMode: () => {}
    }
  ) => {
    const tableComponent = shallow(<TableComponent {...props} />);

    return tableComponent;
  };

  describe('render()', () => {
    it('should match the snapshot', () => {
      const data = [
        {
          name: { text: 'Ameer', isSelector: true },
          age: { text: 22 }
        },
        {
          name: { text: 'Shanmugam', isSelector: true },
          age: { text: 22 }
        }
      ];
      const tableComponent = createTableComponent({
        data,
        namespace: 'some-namedspace',
        actions: [],
        cellSpacing: 5,
        onActionPerformed: () => {},
        stdin: { on: () => {} },
        setRawMode: () => {}
      });

      expect(tableComponent).toMatchSnapshot();
    });

    it('should render nothing when the data prop is undefined', () => {
      const tableComponent = createTableComponent();

      expect(tableComponent.text()).toBeFalsy();
    });

    it('should render action bar with actions prop as this.props.actions', () => {
      const actions = [
        {
          key: 'd',
          description: 'DELETE'
        }
      ];
      const tableComponent = createTableComponent({
        data: [
          {
            name: { text: 'Ameer' }
          }
        ],
        actions,
        namespace: 'some-namespace',
        stdin: { on: () => {} },
        setRawMode: () => {}
      });

      const actionBarComponent = tableComponent
        .find(ActionBarComponent)
        .first();

      expect(actionBarComponent.props().actions).toEqual(actions);
    });

    it('this.props.onActionPerformed should be called with {key, name, namespace} when onActionPerformed is called in action bar', () => {
      const tableComponent = createTableComponent({
        data: [
          {
            name: { text: 'Ameer', isSelector: true }
          }
        ],
        actions: [
          {
            key: 'd',
            description: 'delete'
          }
        ],
        namespace: 'some-namespace',
        onActionPerformed: jest.fn(),
        stdin: { on: () => {} },
        setRawMode: () => {}
      });
      const actionBarComponent = tableComponent
        .find(ActionBarComponent)
        .first();
      const key = { name: 'd' };

      actionBarComponent.props().onActionPerformed(key);

      expect(
        tableComponent.instance().props.onActionPerformed
      ).toHaveBeenCalledWith({
        key,
        name: tableComponent.instance().selectedText,
        namespace: tableComponent.instance().props.namespace
      });
    });
  });
});

describe('SelectionHighlighterComponent', () => {
  it('should match the snapshot', () => {
    const highlighterComponent = shallow(
      <SelectionHighlighterComponent isSelected={true} content="something" />
    );

    expect(highlighterComponent).toMatchSnapshot();
  });

  it('should return blue background colored component when highlighted', () => {
    const highlighterComponent = shallow(
      <SelectionHighlighterComponent isSelected={true} content="something" />
    );
    const colorComponent = highlighterComponent
      .find(Color)
      .find(Color)
      .first();

    expect(colorComponent.props().bgBlue).toBeTruthy();
  });

  it('should return white colored component when highlighted', () => {
    const highlighterComponent = shallow(
      <SelectionHighlighterComponent isSelected={true} content="something" />
    );
    const colorComponent = highlighterComponent
      .find(Color)
      .find(Color)
      .first();

    expect(colorComponent.props().white).toBeTruthy();
  });

  it('should return colored component with selected text when highlighted', () => {
    const content = 'something';
    const highlighterComponent = shallow(
      <SelectionHighlighterComponent isSelected={true} content={content} />
    );
    const colorComponent = highlighterComponent
      .find(Color)
      .find(Color)
      .first();

    expect(colorComponent.childAt(0).text()).toEqual(content);
  });

  it('should just return text when not highlighted', () => {
    const content = 'something';
    const highlighterComponent = shallow(
      <SelectionHighlighterComponent isSelected={false} content={content} />
    );

    expect(highlighterComponent.childAt(0).text()).toEqual(content);
  });
});
