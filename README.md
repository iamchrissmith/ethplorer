# Ethplorer

Ethplorer is a simple cli block explorer for the Ethereum blockchain.

## Running

It has two modes: 

- Rewind mode: use the `-r` or `--rewind` flag to tell Ethplorer how many blocks back in time you'd like to ethplore.
- Range mode: use the `-s` + `-e` or `--startBlock` + `--endBlock` flags to tell Ethplorer which range of blocks you want to explore. (Note: `endBlock` will be included in the results).

Example commands:
`node index.js -r 5`: report on the last 5 blocks
`node index.js -s 100000 -e 100010`: report on the blocks 100,000 - 100,010

Other Commands: 
`-V`/`--version`: version information about Ethplorer
`-h`/`-help`: Help about the available commands.

## Output

The Ethplorer is build to tell you about the transfer of Ether that occurred in the block range.

It will report to you the total Ether Sent as well as the addresses that participated in a transaction in the blocks.

If an address that participated in a transfer is a contract then it will be blue.

Sample Output for blocks 1

```
----------------
Total Ether Sent
----------------
11.9662

Senders
--------------------------------------------------
Address                                     Ether
------------------------------------------  ------
0xb79349DdE6D26D12f5de10Bf700859f5bB8E1D9f  0
0xC3Dfa955C803a1559979cD2D3165F461dc9b5138  0
0x31B98D14007bDEe637298086988A0bBd31184523  11
0x7EA0b83871f5E632ddb30ff510F92D977ec32750  0
0x2e64b987cA66D5f88Be38b04c00B1c0c5F56F470  0.0162
0xFedA60643713aFe689063a64651FC3BFF34A7208  0.95

Recipients
--------------------------------------------------
Address                                     Ether
------------------------------------------  ------
0x1cea75adfC0D435307A46Ed1bdE61E0A7130D398  0
0xf373783cED45fFB05772bB21c2027380F001378b  0 (contract address would be blue)
0x4811E6996291Cd78B9F9272EaD30Da18774DB174  2
0x8394A052eb6c32FB9DEFcAabc12fCBD8FEA0B8A8  2
0x7EA0b83871f5E632ddb30ff510F92D977ec32750  1
0xfdf1210FC262C73d0436236A0E07be419baBBBC4  1.0162
0x4A2D3Fc1587494cA2ca9CDeB457CD94BE5D96A61  2
0x12890D2cce102216644c59daE5baed380d84830c  1
0xA1f1C204b3F16c3f892445ae7058b3E2f0c2E70C  0 (contract address would be blue)
0xFedA60643713aFe689063a64651FC3BFF34A7208  1
0xF56692DEd4d9C7f851bb82F4e3ec98d49c04d40f  0.95
0xF36d081965A0DeeDCF65178261fe83CE29340292  1
```

## How to test

You can run the tests by running `npm run test` from within the tool's directory.

## How to install

