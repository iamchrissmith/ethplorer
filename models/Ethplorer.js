const assert = require('assert');
const Block = require('./Block');
const Transaction = require('./Transaction');
const Reporter = require('./Reporter');
const Printer = require('./Printer');

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

    if (
      !this.program.hasOwnProperty('rewind') &&
      !(this.program.hasOwnProperty('startBlock') && this.program.hasOwnProperty('endBlock'))
    ) {
      const err = new Error('You must provide a start and end block value');
      throw err;
    }

    if( this.program.hasOwnProperty('rewind')) {
      await this.rewind();
    } else {
      await this.getBlocks(parseInt(this.program.startBlock), parseInt(this.program.endBlock) + 1);
    }

    this.report = await this.buildReport();
    const printer = new Printer();
    printer.print(this.report);
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
    this.transactions = [];
    console.log(`Getting blocks from ${start} to ${end - 1} (inclusive)`);
    for(let i = start; i < end; i++) {
      const block = await this.web3.eth.getBlock(i, true);
      for (const tx of block.transactions) {
        this.transactions.push(new Transaction(tx));
      }
      this.blocks.push(new Block(block));
    }
  }

  async buildReport() {
    const reporter = new Reporter(this.web3, this.transactions);
    return await reporter.build();
  }
}