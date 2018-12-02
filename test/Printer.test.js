const {assert} = require('chai');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const colors = require('colors');

const Printer = require('../models/Printer.js');

describe('Printer', function() {
  let printer;
  let fakeReport;

  beforeEach(() => {
    fakeReport = {
      total: '1000000000000000000',
      to: {
        '0x123': {
          wei: '1000000000000000000',
          contract: false,
        },
      },
      from: {
        '0x321': {
          wei: '500000000000000000',
          contract: true,
        }
      }
    };
    printer = new Printer();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.print()', () => {
    it('it should call console.table three times', async () => {
      const shiftStub = sandbox.stub(printer, 'shiftDecimal').returns(1);
      const buildStub = sandbox.stub(printer, 'buildTable').returns(['table']);
      const tableStub = sandbox.stub(console, 'table');

      printer.print(fakeReport);
      
      sinon.assert.calledOnce(shiftStub);
      sinon.assert.calledTwice(buildStub);

      sinon.assert.calledThrice(tableStub);
      const summaryCall = tableStub.getCall(0);
      sinon.assert.calledWith(tableStub,
        'Summary',
        [{'Total Ether Sent': 1}],
      );
      sinon.assert.calledWith(tableStub,
        'Recipients',
        ['table'],
      );
      sinon.assert.calledWith(tableStub,
        'Senders',
        ['table'],
      );
    });
  });

  describe('.buildTable', () => {
    const expectedToTable = [
      {
        address: '0x123',
        ether: 1,
      }
    ];

    const expectedFromTable = [
      {
        address: colors.blue('0x321'),
        ether: 1,
      }
    ];

    it('it should format the data into a printable table', () => {
      const shiftStub = sandbox.stub(printer, 'shiftDecimal').returns(1);
      const result = printer.buildTable(fakeReport.to);
      sinon.assert.calledOnce(shiftStub);
      sinon.assert.calledWith(shiftStub, fakeReport.to['0x123'].wei);
      assert.deepEqual(result, expectedToTable);
    });

    it('it should add blue coloring to contract addresses', () => {
      const shiftStub = sandbox.stub(printer, 'shiftDecimal').returns(1);
      const result = printer.buildTable(fakeReport.from);
      sinon.assert.calledOnce(shiftStub);
      sinon.assert.calledWith(shiftStub, fakeReport.from['0x321'].wei);
      assert.deepEqual(result, expectedFromTable);
    });
  });

  describe('.shiftDecimal', () => {
    it('it should return the amount shifted from wei to ether', () => {
      const result = printer.shiftDecimal('1000000000000000000');
      assert.equal(result, 1);
    });
  })
});