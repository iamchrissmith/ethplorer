const cTable = require('console.table');
module.exports = class Printer {
  buildTable(data) {
    const keys = Object.keys(data);
    const table = [];
    for(let i = 0; i < keys.length; i++) {
      const address = keys[i];
      table.push({
        address: address,
        ether: data[address].wei,
        contract: data[address].contract,
      });
    }
    return table;
  }
  print(report) {
    console.log('results');
    console.table('Summary', [{'Total Ether Sent': report.total.toString()}]);
    console.table('Recipients', this.buildTable(report.to));
    console.table('Senders', this.buildTable(report.from));
  }
}