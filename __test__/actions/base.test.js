'use strict';
const { baseExecuteAction } = require('../../src/actions/base');
const clipboardy = require('clipboardy');

describe('executeAction()', () => {
  beforeEach(() => {
    clipboardy.writeSync = jest.fn().mockResolvedValue();
  });

  it('should call clipboardy.writeSync()', () => {
    const name = 'some-pod-name';
    baseExecuteAction({ name: 'c' }, name);

    expect(clipboardy.writeSync).toHaveBeenCalledWith(name);
  });

  it('should exit the program without any fuss', () => {
    process.exit = jest.fn();

    baseExecuteAction({ name: 'q' });

    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
