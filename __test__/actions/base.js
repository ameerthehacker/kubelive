'use strict';
const { executeAction } = require('../../actions/base');
const clipboardy = require('clipboardy');

describe('executeAction()', () => {
  beforeEach(() => {
    clipboardy.writeSync = jest.fn().mockResolvedValue();
  });

  it('should call clipboardy.writeSync()', () => {
    const name = 'some-pod-name';
    executeAction({ name: 'c' }, name);

    expect(clipboardy.writeSync).toHaveBeenCalledWith(name);
  });
});
