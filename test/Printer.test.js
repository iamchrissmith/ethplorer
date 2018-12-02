const {assert} = require('chai');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

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
});