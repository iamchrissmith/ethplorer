#!/usr/bin/env node
const program = require('commander');
const colors = require('colors');

const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/c65b94c5bb2946b5b3a1bd0c084e8ac5');
const Ethplorer = require('./models/Ethplorer.js');

const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('Ethploring the chain... %s\r');
spinner.setSpinnerString(19);

program
  .version('0.1.0')
  .option('-r, --rewind <n>', 'How many blocks back should we travel')
  .option('-s, --startBlock <n>', 'Starting block number')
  .option('-e, --endBlock <n>', 'End block number (inclusive)');

program.on('--help', function(){
  console.log('')
  console.log('Formatting Notes:');
  console.log('  - Transfer values shown in ether');
  console.log(`  - Contract addresses are shown in ${colors.blue('blue')}`);
});
program.parse(process.argv);


const run = async () => {
  try {
    spinner.start();
    const ethplorer = new Ethplorer(web3, program);
    await ethplorer.run();
    spinner.stop(false);
  } catch (e) {
    console.log('There was a problem with the program');
    console.log(e);
  }

  process.exit();
};

run();