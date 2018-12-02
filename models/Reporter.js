const BN = require('bignumber.js');

module.exports = class Reporter {
  constructor(_txs) {
    this.txs = _txs;
    this.results = {
      total: BN(0),
      recipients: {},
      senders: {},
    }
  }

  async build() {
    for(let i = 0; i < this.txs.length; i++){
      const tx = this.txs[i].data;
      this.results.total = this.results.total.plus(tx.value);
      this.results.recipients[tx.to] = {
        wei: 
          this.results.recipients[tx.to] ? 
          this.results.recipients[tx.to].wei.plus(tx.value) : 
          new BN(0).plus(tx.value),
        contract: false
      };
      this.results.senders[tx.from] = {
        wei: 
          this.results.senders[tx.from] ? 
          this.results.senders[tx.from].wei.plus(tx.value) : 
          new BN(0).plus(tx.value),
        contract: false
      };
    }
    return this.results;
  }
}