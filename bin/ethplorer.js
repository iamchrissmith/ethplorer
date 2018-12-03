#!/usr/bin/env node
require('dotenv').load();
const program = require('commander');
const colors = require('colors');

const Ethplorer = require('../models/Ethplorer.js');

program
  .version('0.1.0')
  .option('-r, --rewind <n>', 'How many blocks back should we travel')
  .option('-s, --startBlock <n>', 'Starting block number')
  .option('-e, --endBlock <n>', 'End block number (inclusive)')
  .option('-c, --chain <s>', 'Chain you would like to ethplore');

program.on('--help', function(){
  console.log('')
  console.log('Formatting Notes:');
  console.log('  - Transfer values shown in ether');
  console.log(`  - Contract addresses are shown in ${colors.bgBlue(colors.black('blue'))}`);
});
program.parse(process.argv);

const chain = program.chain || process.env.CHAIN || 'rinkeby';

const Web3 = require('web3');
const web3 = new Web3(`https://${chain}.infura.io/v3/${process.env.INFURA_ID}`);

const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner(`Ethploring the ${chain} chain... %s\r`);
spinner.setSpinnerString(19);


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