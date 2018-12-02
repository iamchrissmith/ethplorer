const {assert} = require('chai');
const BN = require('bignumber.js');
const sinon = require('sinon');
const Tx = require('../models/Transaction');

const fakeTx = require('./_fixtures/FakeTx.js');
const fakeTx1 = JSON.parse(JSON.stringify(fakeTx));
fakeTx1.data.value = '500000000000000000';
fakeTx1.data.from = '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6';
fakeTx1.data.to = '0x0000000000000000000000000000000000000000';
const FakeWeb3 = require('./_mocks/FakeWeb3.js');

const Reporter = require('../models/Reporter.js');

describe('Reporter', function() {
  let report;
  let fakeData;
  let expectedResults;
  let expectedContracts = {};
  let web3;

  beforeEach(() => {
    web3 = new FakeWeb3();
    web3.getCode = sinon.stub()
      .withArgs(fakeTx.data.to).returns('0x')
      .withArgs(fakeTx.data.from).returns('0x123')
      .withArgs(fakeTx1.data.to).returns('0x');
    
    fakeTxs = [new Tx(fakeTx), new Tx(fakeTx1)];
    reporter = new Reporter(web3, fakeTxs);

    expectedResults = {
      total: new BN(fakeTx.data.value).plus(fakeTx1.data.value),
      to: {
        '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6': {
          wei: new BN(1000000000000000000),
          contract: false,
        },
        '0x0000000000000000000000000000000000000000': {
          wei: new BN(500000000000000000),
          contract: false,
        },
      },
      from: {
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

    expectedContracts[fakeTx.data.to] = false;
    expectedContracts[fakeTx.data.from] = true;
    expectedContracts[fakeTx1.data.to] = false;
  });

  afterEach(() => {
  })

  describe('constructor', () => {
    it('it should save data', async () => {
      assert.instanceOf(reporter.web3, FakeWeb3);
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
      assert.property(result, 'to');
      assert.isObject(result.to);
      assert.property(result, 'from');
      assert.isObject(result.from);
    });

    it('it should sum ether', async () => {
      const result = await reporter.build();
      assert.equal(result.total.toString(), expectedResults.total.toString());
    });

    it('it should report recipients', async () => {
      const result = await reporter.build();
      assert.deepEqual(result.to, expectedResults.to);
    });

    it('it should report senders', async () => {
      const result = await reporter.build();
      assert.deepEqual(result.from, expectedResults.from);
    });
  });

  describe('.sumAddress', () => {
    it('it should return value when first transaction', () => {
      const result = reporter.sumAddress('from', fakeTx.data);
      assert.equal(result.toString(), fakeTx.data.value);
    });
    it('it should return sum when second transaction', () => {
      const expectedResult = new BN(fakeTx.data.value).plus(fakeTx.data.value);
      reporter.results.from[fakeTx.data.from] = {
        wei: new BN(fakeTx.data.value),
      }
      const result = reporter.sumAddress('from', fakeTx.data);
      assert.equal(result.toString(), expectedResult.toString());
    });
  });

  describe('.isContract', () => {
    it('it should call web3.getCode if it is an unknown address', async () => {
      assert.isTrue(!reporter.results.to[fakeTx.data.to] && !reporter.results.from[fakeTx.data.to]);
      const result = await reporter.isContract(fakeTx.data.to);
      sinon.assert.calledOnce(web3.getCode);
      sinon.assert.calledWith(web3.getCode, fakeTx.data.to);
      assert.equal(expectedContracts[fakeTx.data.to], result);
    });

    it('it should not call web3.getCode if it is a known recipient address', async () => {
      reporter.results.to[fakeTx.data.to] = {
        contract: expectedContracts[fakeTx.data.to],
      }

      const result = await reporter.isContract(fakeTx.data.to);
      sinon.assert.notCalled(web3.getCode);
      assert.equal(expectedContracts[fakeTx.data.to], result);
    });

    it('it should not call web3.getCode if it is a known sender address', async () => {
      reporter.results.from[fakeTx.data.to] = {
        contract: expectedContracts[fakeTx.data.to],
      }

      const result = await reporter.isContract(fakeTx.data.to);
      sinon.assert.notCalled(web3.getCode);
      assert.equal(expectedContracts[fakeTx.data.to], result);
    });
  });
});