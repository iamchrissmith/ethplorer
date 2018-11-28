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
      ethplorer.web3.eth.getBlockNumber = sandbox.fake();
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
});