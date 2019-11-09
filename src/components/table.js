'use strict';
const React = require('react');
const { Color } = require('ink');
const { Box } = require('ink');
const PropTypes = require('prop-types');
const importJsx = require('import-jsx');
const ActionBarComponent = importJsx('../components/action-bar');

const SelectionHighlighterComponent = ({ content, isSelected }) => {
  if (isSelected) {
    return (
      <Color bgBlue white>
        {content}
      </Color>
    );
  } else {
    return <React.Fragment>{content}</React.Fragment>;
  }
};

SelectionHighlighterComponent.propTypes = {
  content: PropTypes.any.isRequired,
  isSelected: PropTypes.bool.isRequired
};
class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };
    this.selectedText = '';
  }

  componentDidMount() {
    this.props.setRawMode(true);
    this.props.stdin.on('keypress', (chunk, key) => {
      if (this.props.data && this.props.data.length > 0) {
        if (key.name == 'down') {
          this.setState({
            selectedIndex:
              (this.state.selectedIndex + 1) % this.props.data.length
          });
        } else if (key.name == 'up') {
          if (this.state.selectedIndex == 0) {
            this.setState({ selectedIndex: this.props.data.length - 1 });
          } else {
            this.setState({ selectedIndex: this.state.selectedIndex - 1 });
          }
        }
      }
    });
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.namespace != prevProps.namespace) {
      this.setState({ ...this.state, selectedIndex: 0 });

      if (this.props.data.length > 0)
        if (this.state.selectedIndex > this.props.data.length - 1) {
          // This is to prevent improper selected index when an item gets deleted
          const newSelectedIndex =
            this.state.selectedIndex % this.props.data.length;
          this.setState({ ...this.state, selectedIndex: newSelectedIndex });
        }
    }

    return null;
  }

  componentDidUpdate() {}

  /**
   * For an array of [{ name: 'ameer', city: 'madurai' }, { name: 'bala', city: 'bengaluru' }] it returns { name: 5, city: 9 }
   * @param {*} array array of objects
   * @param {*} header key of the object for which the max length its value in the entire array is to be found
   * @returns key value pair of header and its length of its max length string in the entire array
   */
  findMaxLengthText(array, header) {
    let maxLength = header.length;

    array.forEach((element) => {
      const text = new String(element[header].text);
      if (text.trim().length > maxLength) {
        maxLength = text.trim().length;
      }
    });

    return maxLength;
  }

  /**
   * Creates string with specified number of spaces
   * @param {number} noOfSpaces number spaces to be added to the empty string
   * @returns string with specified number of spaces
   */
  emptySpaces(noOfSpaces) {
    return new Array(noOfSpaces + 1).join(' ');
  }

  /**
   * if the string is **'Ameer'** and the noOfSpaces is **4** then it would return '\*\*Ameer\*\*' where each * represents a blank space
   * @param {string} string string content which is to be padded
   * @param {number} noOfSpaces number of spaces that is to be padded around the text
   */
  padAroundStringWithSpaces(string, noOfSpaces, extraSpace = 0) {
    const text = new String(string);
    const diff = noOfSpaces - text.length;
    const spaceAtOneEnd = Math.floor(diff / 2);
    const remainingSpace = diff - spaceAtOneEnd * 2;

    const paddedText = `${this.emptySpaces(
      spaceAtOneEnd + extraSpace
    )}${text}${this.emptySpaces(spaceAtOneEnd + remainingSpace + extraSpace)}`;

    return paddedText;
  }

  /**
   * It wraps the text content with specified font and background colors
   * @param {string} content string content that is to be displayed
   * @returns string content wrapped in Color component with specified font and background colors
   */
  colorizeText(content) {
    if (content.color == undefined && content.bgColor == undefined) {
      return content.text;
    } else {
      const props = {};

      if (content.color != undefined) {
        props[content.color] = true;
      }
      if (content.bgColor != undefined) {
        props['bgKeyword'] = content.bgColor;
      }

      return <Color {...props}>{content.text}</Color>;
    }
  }

  getTableHeaderTexts(data) {
    return Object.keys(data[0]);
  }

  getMaxLengthOfTextInHeaders(data) {
    const tableHeaderTexts = this.getTableHeaderTexts(data);
    const maxLengthOfTextInHeader = {};

    tableHeaderTexts.forEach((header) => {
      maxLengthOfTextInHeader[header] = this.findMaxLengthText(data, header);
    });

    return maxLengthOfTextInHeader;
  }

  padAroundTableValues(data, maxLengthOfTextInHeader) {
    const dataCopy = data;
    const tableHeaderTexts = this.getTableHeaderTexts(data);

    // Pad texts with spaces if needed
    dataCopy.forEach((row) => {
      tableHeaderTexts.forEach((header) => {
        // Pad text specifies extra space that is to the cell
        if (row[header].padText) {
          row[header].text = this.padAroundStringWithSpaces(
            row[header].text,
            maxLengthOfTextInHeader[header],
            row[header].extraPadding
          );
        }
      });
    });

    return dataCopy;
  }

  getTableContent(data, maxLengthOfTextInHeader, cellSpacing) {
    const paddedData = this.padAroundTableValues(data, maxLengthOfTextInHeader);
    const tableHeaderTexts = this.getTableHeaderTexts(data);

    return paddedData.map((row, rowIndex) => {
      const tableContent = [];

      tableHeaderTexts.forEach((header, columnIndex) => {
        const isSelected =
          row[header].isSelector && rowIndex == this.state.selectedIndex
            ? true
            : false;
        const tableContentTextRef = this.colorizeText(
          row[header],
          maxLengthOfTextInHeader[header]
        );

        // Update selected text
        if (isSelected) {
          this.selectedText = row[header].text;
        }

        tableContent.push(
          <Box
            key={columnIndex}
            width={maxLengthOfTextInHeader[header] + cellSpacing}
          >
            <SelectionHighlighterComponent
              content={tableContentTextRef}
              isSelected={isSelected}
            />
          </Box>
        );
      });

      return <Box key={rowIndex}>{tableContent}</Box>;
    });
  }

  getTableHeader(data, maxLengthOfTextInHeader, cellSpacing) {
    const tableHeader = [];
    const tableHeaderTexts = this.getTableHeaderTexts(data);

    tableHeaderTexts.forEach((header, index) => {
      tableHeader.push(
        <Box key={index} width={maxLengthOfTextInHeader[header] + cellSpacing}>
          <Color green>{header.toUpperCase()}</Color>
        </Box>
      );
    });

    return tableHeader;
  }

  render() {
    const data = this.props.data;
    const cellSpacing = this.props.cellSpacing || 5;

    if (!data || data.length == 0) {
      return '';
    }

    const maxLengthOfTextInHeader = this.getMaxLengthOfTextInHeaders(data);
    const tableHeader = this.getTableHeader(
      data,
      maxLengthOfTextInHeader,
      cellSpacing
    );
    const tableContent = this.getTableContent(
      data,
      maxLengthOfTextInHeader,
      cellSpacing
    );

    return (
      <React.Fragment>
        <ActionBarComponent
          actions={this.props.actions}
          stdin={this.props.stdin}
          setRawMode={this.props.setRawMode}
          onActionPerformed={(key) => {
            if (this.props.onActionPerformed) {
              this.props.onActionPerformed({
                key,
                name: this.selectedText,
                namespace: this.props.namespace
              });
            }
          }}
        />
        <Box flexDirection="row">{tableHeader}</Box>
        <Box flexDirection="column">{tableContent}</Box>
      </React.Fragment>
    );
  }
}

TableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  cellSpacing: PropTypes.number,
  actions: PropTypes.array,
  onActionPerformed: PropTypes.func,
  namespace: PropTypes.string,
  stdin: PropTypes.object.isRequired,
  setRawMode: PropTypes.func.isRequired
};

module.exports = {
  TableComponent,
  SelectionHighlighterComponent
};
