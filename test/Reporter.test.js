const {assert} = require('chai');

const fakeTx = require('./_fixtures/FakeTx.js');
const Reporter = require('../models/Reporter.js');

describe('Reporter', function() {
  let report;
  let fakeData;

  beforeEach(() => {
    fakeTxs = [fakeTx];
    report = new Reporter(fakeTxs);
  });

  afterEach(() => {
  })

  describe('constructor', () => {
    it('it should save data', async () => {
      assert.isArray(report.txs);
      assert.equal(report.txs[0].blockHash, fakeTx.blockHash);
    });
  });
});