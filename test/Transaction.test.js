const {assert} = require('chai');

const Transaction = require('../models/Transaction.js');

describe('Transaction', function() {
  let tx;
  let fakeData;

  beforeEach(() => {
    fakeData = {
      blockHash: "0x038d9a3c6df7bf9e02ff909bec135d0b8984b89c7f0b18ddc7a93a7cf1e1581e",
    }
    tx = new Transaction(fakeData);
  });

  afterEach(() => {
  })

  describe('constructor', () => {
    it('it should save data', async () => {
      assert.isObject(tx.data);
      assert.equal(tx.data.blockHash, fakeData.blockHash);
    });
  });
});