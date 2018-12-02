const BN = require('bignumber.js');

module.exports = class Reporter {
  constructor(_txs) {
    this.txs = _txs;
    this.results = {
      total: BN(0),
      recipients: [],
      senders: [],
    }
  }

  async build() {
    for(let i = 0; i < this.txs.length; i++){
      const tx = this.txs[i].data;
      this.results.total = this.results.total.plus(tx.value);
    }
    return this.results;
  }
}