const {assert} = require('chai');
const BN = require('bignumber.js');

const fakeTx = require('./_fixtures/FakeTx.js');
const fakeTx1 = JSON.parse(JSON.stringify(fakeTx));
fakeTx1.data.value = '500000000000000000';
fakeTx1.data.from = '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6';
fakeTx1.data.to = '0x0000000000000000000000000000000000000000';
const Reporter = require('../models/Reporter.js');

describe('Reporter', function() {
  let report;
  let fakeData;
  let expectedResults;

  beforeEach(() => {
    fakeTxs = [fakeTx, fakeTx1];
    reporter = new Reporter(fakeTxs);
    expectedResults = {
      total: new BN(fakeTx.data.value).plus(fakeTx1.data.value),
      recipients: {
        '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6': {
          wei: new BN(1000000000000000000),
          contract: false,
        },
        '0x0000000000000000000000000000000000000000': {
          wei: new BN(500000000000000000),
          contract: false,
        },
      },
      senders: {
        '0x7BC658E83A94bff25d69E8a3ac289aA3b4D539B9': {
          wei: new BN(1000000000000000000),
          contract: false,
        },
        '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6': {
          wei: new BN(500000000000000000),
          contract: false,
        },
      },
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
      assert.isObject(result.recipients);
      assert.property(result, 'senders');
      assert.isObject(result.senders);
    });

    it('it should sum ether', async () => {
      const result = await reporter.build();
      assert.equal(result.total.toString(), expectedResults.total.toString());
    });

    it('it should report recipients', async () => {
      const result = await reporter.build();
      assert.deepEqual(result.recipients, expectedResults.recipients);
    });

    it('it should report senders', async () => {
      const result = await reporter.build();
      assert.deepEqual(result.senders, expectedResults.senders);
    });
  });

  // How much Ether was transferred in total?
  // Which addresses received Ether and how much did they receive in total?
  // Which addresses sent Ether and how much did they send in total?
  // Of these addresses, which are contract addresses?
});