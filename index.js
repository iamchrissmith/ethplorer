#!/usr/bin/env node

const program = require('commander');

const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/c65b94c5bb2946b5b3a1bd0c084e8ac5');

program
  .version('0.1.0')
  .option('-r, --rewind <n>', 'How many blocks back')
  .option('-s, --startBlock <n>', 'Starting block number')
  .option('-e, --endBlock <n>', 'End block number (inclusive)')
  .parse(process.argv);

const run = async () => {
  console.log('starting program');
  const blockNumber = await web3.eth.getBlockNumber();
  console.log('Current blockNumber', blockNumber);
  console.log(program.blockNumber, program.startBlock, program.endBlock);
};

run();