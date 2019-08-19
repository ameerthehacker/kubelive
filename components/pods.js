const React = require('react');
const propTypes = require('prop-types');
const { Color } = require('ink');
const { Box } = require('ink');

const findMaxLengthText = (array, header) => {
  let maxLength = header.length;

  array.forEach(element => {
    if(element[header].text.length > maxLength) {
      maxLength = element[header].text.length;
    }
  });

  return maxLength;
}

const emptySpaces = (number) => {
  return new Array(number).join(' ');
}

const colorizeText = (content, maxLength) => {
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

    const extraSpaceArountText = 2;
    const spaceAroundText = Math.ceil((maxLength - content.text.length) / 2) + extraSpaceArountText;
    const prettyText = `${emptySpaces(spaceAroundText)}${content.text}${emptySpaces(spaceAroundText)}`;

    return <Color {...props}>{prettyText}</Color>
  }
}

const PodsComponent = ({ pods }) => {
  if(pods.length > 0) {
    const tableHeaderTexts = Object.keys(pods[0]);
    const cellSpacing = 5;
    const maxLengthOfTextInHeader = {};

    tableHeaderTexts.forEach(header => {
      maxLengthOfTextInHeader[header] = findMaxLengthText(pods, header);
    });
    
    const tableContent = pods.map((pod, row) => {
      const tableContent = [];

      tableHeaderTexts.forEach((header, column) => {
        tableContent.push(
          <Box key={column} width={maxLengthOfTextInHeader[header] + cellSpacing}>
            {colorizeText(pod[header], maxLengthOfTextInHeader[header])}
          </Box>
        );
      });

      return (
        <Box key={row}>
          {tableContent}
        </Box>
      );
    });

    const tableHeader = [];

    tableHeaderTexts.forEach((header, index) => {
      tableHeader.push(
        <Box key={header} width={maxLengthOfTextInHeader[header] + cellSpacing}>
          <Color green>{header.toUpperCase()}</Color>
        </Box>
      )
    });

    return <React.Fragment>
      <Box paddingLeft={1} marginTop={1} flexDirection="row">
        {tableHeader}
      </Box>
      <Box paddingLeft={1} flexDirection="column">
        {tableContent}
      </Box>
    </React.Fragment>
  }
  else {
    return "";
  }
}

PodsComponent.propTypes = {
  pods: propTypes.array
};

module.exports = PodsComponent;