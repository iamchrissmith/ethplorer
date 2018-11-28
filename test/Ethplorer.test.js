const chai = require('chai');
const {assert} = chai;

const Ethplorer = require('../models/Ethplorer.js');
const FakeWeb3 = require('./mocks/FakeWeb3.js');

describe('Ethplorer', function() {
  let ethplorer;

  beforeEach(() => {
    const web3 = new FakeWeb3();
    const program = {};
    ethplorer = new Ethplorer(web3, program);
  });

  describe('constructor', () => {
    it('it should save web3 and program', async () => {
      assert.instanceOf(ethplorer.web3, FakeWeb3);
      assert.isObject(ethplorer.program);
    });
  });

  describe.skip('.run', () => {
    it('it should throw error if both search options are provided', async () => {

    });
  });
});