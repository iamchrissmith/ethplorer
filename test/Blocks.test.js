const {assert} = require('chai');

const Block = require('../models/Block.js');

describe('Block', function() {
  let block;
  let fakeData;

  beforeEach(() => {
    fakeData = {
      number: 1,
    }
    block = new Block(fakeData);
  });

  afterEach(() => {
  })

  describe('constructor', () => {
    it('it should save data', async () => {
      assert.isObject(block.data);
      assert.equal(block.data.number, fakeData.number);
    });
  });
});