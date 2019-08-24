const { colorCodeStatus } = require('../../transformers/pod');

describe('colorCodeStatus()', () => {
  it('should return { bgColor: red, color: white } when status is Terminating', () => {
    const colorCode = colorCodeStatus('Terminating');
    const expectedColorCode = { bgColor: 'red', color: 'white' };

    expect(colorCode).toEqual(expectedColorCode);
  });

  it('should return { bgColor: red, color: white } when status is Failed', () => {
    const colorCode = colorCodeStatus('Failed');
    const expectedColorCode = { bgColor: 'red', color: 'white' };

    expect(colorCode).toEqual(expectedColorCode);
  });

  it('should return { bgColor: yellow, color: white } when status is Failed', () => {
    const colorCode = colorCodeStatus('Pending');
    const expectedColorCode = { bgColor: 'yellow', color: 'white' };

    expect(colorCode).toEqual(expectedColorCode);
  });

  it('should return { bgColor: green, color: white } when status is Succeeded', () => {
    const colorCode = colorCodeStatus('Succeeded');
    const expectedColorCode = { bgColor: 'green', color: 'white' };

    expect(colorCode).toEqual(expectedColorCode);
  });

  it('should return { bgColor: green, color: white } when status is Running', () => {
    const colorCode = colorCodeStatus('Running');
    const expectedColorCode = { bgColor: 'green', color: 'white' };

    expect(colorCode).toEqual(expectedColorCode);
  });

  it('should return {} when status is not in the known list', () => {
    const colorCode = colorCodeStatus('something-else');
    const expectedColorCode = {};

    expect(colorCode).toEqual(expectedColorCode);
  });
});
