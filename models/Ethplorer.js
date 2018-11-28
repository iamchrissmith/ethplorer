const assert = require('assert');

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

    const blockNumber = await this.web3.eth.getBlockNumber();
    // console.log('Current blockNumber', blockNumber);
  }
}