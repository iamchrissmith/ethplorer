const {assert} = require('chai');
const sinon = require('sinon');

const Ethplorer = require('../models/Ethplorer.js');
const Block = require('../models/Block.js');
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
      const fakeBlock = {
        "number": 3,
        "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
        "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
        "nonce": "0xfb6e1a62d119228b",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
        "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
        "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
        "difficulty": '21345678965432',
        "totalDifficulty": '324567845321',
        "size": 616,
        "extraData": "0x",
        "gasLimit": 3141592,
        "gasUsed": 21662,
        "timestamp": 1429287689,
        "transactions": [{
          blockHash: "0x038d9a3c6df7bf9e02ff909bec135d0b8984b89c7f0b18ddc7a93a7cf1e1581e",
          blockNumber: 2982271,
          from: "0x9762f6858ccae9ca006485fe1a9e6820a44419b1",
          gas: 43535,
          gasPrice: {s: 1, e: 10, c: Array(1)},
          hash: "0x2501a795f8226cb058fc23e023abd6f7fe9f404ae1355c48afa12c2cc8de7beb",
          input: "0x1d4d691d000000000000000000000000547fb901d6f29f80e2d420aa1d1ab093983efb1f000000000000000000000000000000000000000000000030ca024f987b90000000000000000000000000000029486697424939e376284a73ff20a3e31cb75d200000000000000000000000009762f6858ccae9ca006485fe1a9e6820a44419b100000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000001ef5d2f80951c8c390e2d565d1759bfbf911e19d00000000000000000000000000000000000000000000000000000165f814ebff00000000000000000000000000000000000000000000000000000000000c0872000000000000000000000000000000000000000000000000000000000000001b4c6b8d451cf8d80761a4b135421c022bc1556e76ec7d0941934d178c2f74323000592b27b919a58b1077271ea33d80550ecd0e83c73be61fe1e082c421fdd494",
          nonce: 48,
          r: "0x86b397bdfa7a2368923295993b7474dea5505d80d41507a92784973893837339",
          s: "0x69445ad8a98425569ff6815a48b943a8993ce985f378563dd757a405eb5bf362",
          to: "0xbcd24b757c08843010b94cda1f8d03b90b167313",
          transactionIndex: 0,
          v: "0x2b",
          value: {s: 1, e: 0, c: Array(1)},
        }],
        "uncles": []
      }
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
  });
});