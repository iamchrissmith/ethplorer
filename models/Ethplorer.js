module.exports = class Ethplorer {
  constructor(_web3, _program) {
    this.web3 = _web3;
    this.program = _program;
  }

  async run() {
    if(program.rewind && (program.startBlock || program.endBlock)) {
      const err = new Error('You should provide only a rewind value or start and end block numbers');
      console.error(err.toString());
      throw err;
    }
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Current blockNumber', blockNumber);
    console.log(program.blockNumber, program.startBlock, program.endBlock);
  }
}