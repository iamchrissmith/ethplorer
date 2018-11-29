const {assert} = require('chai');
const sinon = require('sinon');

const Ethplorer = require('../models/Ethplorer.js');
const Block = require('../models/Block.js');
const Transaction = require('../models/Transaction.js');
const Reporter = require('../models/Reporter.js');

const FakeWeb3 = require('./_mocks/FakeWeb3.js');
const fakeBlock = require('./_fixtures/FakeBlock.js');

const sandbox = sinon.createSandbox();

describe('Ethplorer', function() {
  let ethplorer;

  beforeEach(() => {
    const program = {};
    const web3 = new FakeWeb3();
    ethplorer = new Ethplorer(web3, program);
  });

  afterEach(() => {
    sandbox.restore();
  })

  describe('constructor', () => {
    it('it should save web3 and program', async () => {
      assert.instanceOf(ethplorer.web3, FakeWeb3);
      assert.isObject(ethplorer.program);
    });
  });

  describe('.run', () => {
    let buildReportStub;
    beforeEach(() => {
      buildReportStub = sandbox.stub(ethplorer, 'buildReport').returns({});
    });

    it('it should throw error if both rewind and startBlock are provided', async () => {
      try {
        ethplorer.program.rewind = 0;
        ethplorer.program.startBlock = 1;
        await ethplorer.run();
        assert.isFalse(true, 'it should throw on run()');
      } catch(e) {
        const expected = 'Error: You should provide only a rewind value or start and end block numbers';
        assert.equal(e.toString(), expected);
      }
    });

    it('it should throw error if both rewind and endBlock are provided', async () => {
      try {
        ethplorer.program.rewind = 0;
        ethplorer.program.endBlock = 1;
        await ethplorer.run();
        assert.isFalse(true, 'it should throw on run()');
      } catch(e) {
        const expected = 'Error: You should provide only a rewind value or start and end block numbers';
        assert.equal(e.toString(), expected);
      }
    });

    it('it should call buildReport and set to this.reporter', async () => {
      await ethplorer.run();
      sinon.assert.calledOnce(buildReportStub);
      assert.isObject(ethplorer.reporter);
    });

    describe('rewind option provided', () => {
      let rewindStub;

      beforeEach(() => {
        ethplorer.program.rewind = 1;
        rewindStub = sandbox.stub(ethplorer, 'rewind');
      });

      it('it should call rewind()', async () => {
        await ethplorer.run();
        sinon.assert.calledOnce(rewindStub);
      });
    });
  });

  describe('.rewind', () => {
    let getBlocksStub;

    beforeEach(() => {
      ethplorer.program.rewind = 1;
      ethplorer.web3.eth.getBlockNumber = sandbox.fake.returns(3);
      getBlocksStub = sandbox.stub(ethplorer, 'getBlocks');
    });

    it('it should throw if rewind option is not GTE 0', async () => {
      ethplorer.program.rewind = -1;
      try {
        await ethplorer.rewind();
        assert.isFalse(true, 'it should throw');
      } catch(e) {
        const expected = 'AssertionError [ERR_ASSERTION]: Rewind must be a positive integer';
        assert.equal(e.toString(), expected);
      }
    });

    it('it should throw if rewind option is a number', async () => {
      ethplorer.program.rewind = 'bad';
      try {
        await ethplorer.rewind();
        assert.isFalse(true, 'it should throw');
      } catch(e) {
        const expected = 'AssertionError [ERR_ASSERTION]: Rewind must be a positive integer';
        assert.equal(e.toString(), expected);
      }
    });

    it('it should call eth.getBlockNumber()', async () => {
      await ethplorer.rewind();
      sinon.assert.calledOnce(ethplorer.web3.eth.getBlockNumber);
    });

    it('it should call getBlocks()', async () => {
      await ethplorer.rewind();
      sinon.assert.calledOnce(getBlocksStub);
      sinon.assert.calledWith(getBlocksStub, 2, 3);
    });
  });

  describe('.getBlocks', () => {
    beforeEach(() => {
      ethplorer.web3.eth.getBlock = sandbox.fake.returns(fakeBlock);
    });

    it('it should throw if startBlock > endBlock', async () => {
      try {
        await ethplorer.getBlocks(2, 1);
        assert.isFalse(true, 'it should throw');
      } catch(e) {
        const expected = 'AssertionError [ERR_ASSERTION]: Start Block must be less or equal to the End Block';
        assert.equal(e.toString(), expected);
      }
    });

    it('it should call getBlock end - start number of times (inclusive)', async () => {
      await ethplorer.getBlocks(1, 3);
      sinon.assert.calledThrice(ethplorer.web3.eth.getBlock);
    });

    it('it should set an array of Block objects', async () => {
      await ethplorer.getBlocks(1, 1);
      assert.isArray(ethplorer.blocks);
      assert.equal(ethplorer.blocks.length, 1);
      assert.instanceOf(ethplorer.blocks[0], Block);
    });

    it('it should set an array of Transaction objects', async () => {
      await ethplorer.getBlocks(1, 1);
      assert.isArray(ethplorer.transactions);
      assert.equal(ethplorer.transactions.length, 1);
      assert.instanceOf(ethplorer.transactions[0], Transaction);
    });
  });

  describe('.buildReport', () => {
    let fakeReport;
    let reporterBuildStub;
    
    beforeEach(() => {
      // ethplorer.blocks = [new Block(fakeBlock)];
      fakeReport = {report: true};
      ethplorer.transactions = [new Transaction(fakeBlock.transactions[0])];
      reporterBuildStub = sandbox.stub(Reporter.prototype, 'build').returns(fakeReport);
    });

    it('it should call a reporter class to build and return results', async () => {
      const result = await ethplorer.buildReport();
      sinon.assert.calledOnce(reporterBuildStub);
      assert.deepEqual(result, fakeReport);
    });
  });
});