const {assert} = require('chai');
const BN = require('bignumber.js');
const sinon = require('sinon');
const Tx = require('../models/Transaction');

const fakeTx = require('./_fixtures/FakeTx.js');
const fakeTx1 = JSON.parse(JSON.stringify(fakeTx));
fakeTx1.value = '500000000000000000';
fakeTx1.from = '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6';
fakeTx1.to = '0x0000000000000000000000000000000000000000';
const FakeWeb3 = require('./_mocks/FakeWeb3.js');

const Reporter = require('../models/Reporter.js');

const sandbox = sinon.createSandbox();

describe('Reporter', function() {
  let report;
  let fakeData;
  let expectedResults;
  let expectedContracts = {};
  let web3;

  beforeEach(() => {
    web3 = new FakeWeb3();
    web3.eth.getCode = sandbox.stub().returns('0x');
    web3.eth.getCode.withArgs(fakeTx.from).returns('0x123');
    
    fakeTxs = [new Tx(fakeTx), new Tx(fakeTx1)];
    reporter = new Reporter(web3, fakeTxs);

    expectedContracts[fakeTx.to] = false;
    expectedContracts[fakeTx.from] = true;
    expectedContracts[fakeTx1.to] = false;

    expectedResults = {
      total: new BN(fakeTx.value).plus(fakeTx1.value),
      to: {
        '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6': {
          wei: new BN(1000000000000000000),
          contract: expectedContracts['0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6'],
        },
        '0x0000000000000000000000000000000000000000': {
          wei: new BN(500000000000000000),
          contract: expectedContracts['0x0000000000000000000000000000000000000000'],
        },
      },
      from: {
        '0x7BC658E83A94bff25d69E8a3ac289aA3b4D539B9': {
          wei: new BN(1000000000000000000),
          contract: expectedContracts['0x7BC658E83A94bff25d69E8a3ac289aA3b4D539B9'],
        },
        '0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6': {
          wei: new BN(500000000000000000),
          contract: expectedContracts['0x27669D192b5bc0E37Da1D2fDb5eDE5d5bBC695b6'],
        },
      },
    }
  });

  afterEach(() => {
    sandbox.restore();
  })

  describe('constructor', () => {
    it('it should save data', async () => {
      assert.instanceOf(reporter.web3, FakeWeb3);
      assert.isArray(reporter.txs);
      assert.equal(reporter.txs[0].data.blockHash, fakeTx.blockHash);
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
      const result = reporter.sumAddress('from', fakeTx);
      assert.equal(result.toString(), fakeTx.value);
    });
    it('it should return sum when second transaction', () => {
      const expectedResult = new BN(fakeTx.value).plus(fakeTx.value);
      reporter.results.from[fakeTx.from] = {
        wei: new BN(fakeTx.value),
      }
      const result = reporter.sumAddress('from', fakeTx);
      assert.equal(result.toString(), expectedResult.toString());
    });
  });

  describe('.isContract', () => {
    it('it should call web3.eth.getCode if it is an unknown address', async () => {
      assert.isTrue(!reporter.results.to[fakeTx.to] && !reporter.results.from[fakeTx.to]);
      const result = await reporter.isContract(fakeTx.to);
      sinon.assert.calledOnce(web3.eth.getCode);
      sinon.assert.calledWith(web3.eth.getCode, fakeTx.to);
      assert.equal(expectedContracts[fakeTx.to], result);
    });

    it('it should not call web3.eth.getCode if it is a known recipient address', async () => {
      reporter.results.to[fakeTx.to] = {
        contract: expectedContracts[fakeTx.to],
      }

      const result = await reporter.isContract(fakeTx.to);
      sinon.assert.notCalled(web3.eth.getCode);
      assert.equal(expectedContracts[fakeTx.to], result);
    });

    it('it should not call web3.eth.getCode if it is a known sender address', async () => {
      reporter.results.from[fakeTx.to] = {
        contract: expectedContracts[fakeTx.to],
      }

      const result = await reporter.isContract(fakeTx.to);
      sinon.assert.notCalled(web3.eth.getCode);
      assert.equal(expectedContracts[fakeTx.to], result);
    });
  });
});