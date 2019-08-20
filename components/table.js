const React = require('react');
const { Color } = require('ink');
const { Box } = require('ink');
const PropTypes = require('prop-types');

/**
 * For an array of [{ name: 'ameer', city: 'madurai' }, { name: 'bala', city: 'bengaluru' }] it returns { name: 5, city: 9 }
 * @param {*} array array of objects
 * @param {*} header key of the object for which the max length its value in the entire array is to be found
 * @returns key value pair of header and its length of its max length string in the entire array
 */
const findMaxLengthText = (array, header) => {
  let maxLength = header.length;

  array.forEach(element => {
    if(element[header].text.length > maxLength) {
      maxLength = element[header].text.length;
    }
  });

  return maxLength;
}

/**
 * Creates string with specified number of spaces
 * @param {number} noOfSpaces number spaces to be added to the empty string
 * @returns string with specified number of spaces
 */
const emptySpaces = (noOfSpaces) => {
  return new Array(noOfSpaces).join(' ');
}

/**
 * if the string is **'Ameer'** and the noOfSpaces is **4** then it would return '\*\*Ameer\*\*' where each * represents a blank space
 * @param {string} string string content which is to be padded
 * @param {number} noOfSpaces number of spaces that is to be padded around the text
 */
const padAroundStringWithSpaces = (string, noOfSpaces, extraSpace = 0) => {
  const spaceAtOneEnd = Math.ceil((noOfSpaces - string.length) / 2) + extraSpace;
  const paddedText = `${emptySpaces(spaceAtOneEnd)}${string}${emptySpaces(spaceAtOneEnd)}`;

  return paddedText;
}

/**
 * It wraps the text content with specified font and background colors
 * @param {string} content string content that is to be displayed
 * @returns string content wrapped in Color component with specified font and background colors
 */
const colorizeText = (content) => {
  if(content.color == undefined && content.bgColor == undefined) {
    return content.text;
  }
  else {
    const props = {};

    if(content.color != undefined) {
      props[content.color] = true;
    } 
    if(content.bgColor != undefined) {
      props['bgKeyword'] = content.bgColor; 
    }

    return <Color {...props}>{content.text}</Color>
  }
}

const TableComponent = ({ data, cellSpacing }) => {
  if(!data || data.length == 0) {
    return "";
  }

  const tableHeaderTexts = Object.keys(data[0]);
  const maxLengthOfTextInHeader = {};

  // Default cell spacing of 5
  if(!cellSpacing) {
    cellSpacing = 5;
  }

  tableHeaderTexts.forEach(header => {
    maxLengthOfTextInHeader[header] = findMaxLengthText(data, header);
  });

  // Pad texts with spaces if needed
  data.forEach(row => {
    tableHeaderTexts.forEach(header => {
      // Pad text specifies extra space that is to the cell 
      if(row[header].padText !== undefined) {
        row[header].text = padAroundStringWithSpaces(row[header].text, maxLengthOfTextInHeader[header], row[header].padText);
      }
    });
  });

  const tableContent = data.map((row, rowIndex) => {
    const tableContent = [];

    tableHeaderTexts.forEach((header, columnIndex) => {
      tableContent.push(
        <Box key={columnIndex} width={maxLengthOfTextInHeader[header] + cellSpacing}>
          {colorizeText(row[header], maxLengthOfTextInHeader[header])}
        </Box>
      );
    });

    return (
      <Box key={rowIndex}>
        {tableContent}
      </Box>
    );
  });

  const tableHeader = [];

  tableHeaderTexts.forEach((header, index) => {
    tableHeader.push(
      <Box key={index} width={maxLengthOfTextInHeader[header] + cellSpacing}>
        <Color green>{header.toUpperCase()}</Color>
      </Box>
    )
  });

  return <React.Fragment>
    <Box flexDirection="row">
      {tableHeader}
    </Box>
    <Box flexDirection="column">
      {tableContent}
    </Box>
  </React.Fragment>
};

TableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  cellSpacing: PropTypes.number
};

module.exports = TableComponent;