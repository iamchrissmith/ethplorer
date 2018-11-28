const {assert} = require('chai');
const sinon = require('sinon');

const Ethplorer = require('../models/Ethplorer.js');
const FakeWeb3 = require('./mocks/FakeWeb3.js');

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
    beforeEach(() => {
      
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
    beforeEach(() => {
      ethplorer.program.rewind = 1;
      ethplorer.web3.eth.getBlockNumber = sandbox.fake.returns(3);
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
      const getBlocksStub = sandbox.stub(ethplorer, 'getBlocks');
      await ethplorer.rewind();
      sinon.assert.calledOnce(getBlocksStub);
      sinon.assert.calledWith(getBlocksStub, 2, 3);
    });
  });
});