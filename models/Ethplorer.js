const assert = require('assert');
const Block = require('./Block');

module.exports = class Ethplorer {
  constructor(_web3, _program) {
    this.web3 = _web3;
    this.program = _program;
  }

  async run() {
    if (this.program.hasOwnProperty('rewind') && 
        (this.program.hasOwnProperty('startBlock') || this.program.hasOwnProperty('endBlock'))
    ) {
      const err = new Error('You should provide only a rewind value or start and end block numbers');
      throw err;
    }

    
    if( this.program.hasOwnProperty('rewind')) {
      await this.rewind();
    }
  }

  async rewind() {
    assert(this.program.rewind >= 0, 'Rewind must be a positive integer');

    const endBlock = await this.web3.eth.getBlockNumber();
    const startBlock = endBlock - this.program.rewind;
    await this.getBlocks(startBlock, endBlock);
  }

  async getBlocks(start, end) {
    assert(end >= start, 'Start Block must be less or equal to the End Block');
    this.blocks = [];
    for(;start <= end; start++) {
      const block = await this.web3.eth.getBlock(start);
      this.blocks.push(new Block(block));
    }
  }
}