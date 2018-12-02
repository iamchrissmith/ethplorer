const cTable = require('console.table');
const BN = require('bignumber.js');

module.exports = class Printer {
  shiftDecimal(amount) {
    return new BN(amount).shiftedBy(-18).toString();
  }

  buildTable(data) {
    const keys = Object.keys(data);
    const table = [];
    for(let i = 0; i < keys.length; i++) {
      const address = keys[i];
      table.push({
        address: address,
        ether: this.shiftDecimal(data[address].wei),
        contract: data[address].contract,
      });
    }
    return table;
  }
  
  print(report) {
    console.table('Summary', [{'Total Ether Sent': this.shiftDecimal(report.total)}]);
    console.table('Recipients', this.buildTable(report.to));
    console.table('Senders', this.buildTable(report.from));
  }
}