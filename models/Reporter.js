const BN = require('bignumber.js');

module.exports = class Reporter {
  constructor(_web3, _txs) {
    this.web3 = _web3;
    this.txs = _txs;
    this.results = {
      total: BN(0),
      from: {},
      to: {},
    }
  }

  async build() {
    for(let i = 0; i < this.txs.length; i++){
      const tx = this.txs[i].data;
      this.results.total = this.results.total.plus(tx.value);
      this.results.to[tx.to] = {
        wei: this.sumAddress('to', tx),
        contract: false
      };
      this.results.from[tx.from] = {
        wei: this.sumAddress('from', tx),
        contract: false
      };
    }
    return this.results;
  }

  sumAddress(group, tx) {
    const address = tx[group];
    if (this.results[group][address]) {
      return this.results[group][address].wei.plus(tx.value);
    } else {
      return new BN(0).plus(tx.value);
    }
  }

  async isContract(address) {
    if (reporter.results.to[address]) {
      return reporter.results.to[address].contract;
    } else if (reporter.results.from[address]) {
      return reporter.results.from[address].contract;
    } else {
      const code = await this.web3.getCode(address);
      return code !== '0x';
    }
  }
}