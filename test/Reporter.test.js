const {assert} = require('chai');
const BN = require('bignumber.js');

const fakeTx = require('./_fixtures/FakeTx.js');
const Reporter = require('../models/Reporter.js');

describe('Reporter', function() {
  let report;
  let fakeData;
  let expectedResults;

  beforeEach(() => {
    fakeTxs = [fakeTx];
    reporter = new Reporter(fakeTxs);
    expectedResults = {
      total: new BN(1000000000000000000),
      recipients: [{
        address: '0xbcd24b757c08843010b94cda1f8d03b90b167313',
        wei: new BN(1000000000000000000),
        contract: false,
      }],
      senders: [{
        address: '0x9762f6858ccae9ca006485fe1a9e6820a44419b1',
        wei: new BN(-1000000000000000000),
        contract: false,
      }],
    }
  });

  afterEach(() => {
  })

  describe('constructor', () => {
    it('it should save data', async () => {
      assert.isArray(reporter.txs);
      assert.equal(reporter.txs[0].blockHash, fakeTx.blockHash);
    });
  });

  describe('.build', () => {
    it('it should return a results object', async () => {
      const result = await reporter.build();
      assert.isObject(result);
      assert.property(result, 'total');
      assert.instanceOf(result.total, BN);
      assert.property(result, 'recipients');
      assert.isArray(result.recipients);
      assert.property(result, 'senders');
      assert.isArray(result.senders);
    });
    it('it should sum ether', async () => {
      const result = await reporter.build();
      assert.equal(result.total.toString(), expectedResults.total.toString());
    });
  });

  // How much Ether was transferred in total?
  // Which addresses received Ether and how much did they receive in total?
  // Which addresses sent Ether and how much did they send in total?
  // Of these addresses, which are contract addresses?
});