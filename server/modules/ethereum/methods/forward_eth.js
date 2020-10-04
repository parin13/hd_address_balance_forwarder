(()=>{
  'use strict';
    const HTTPStatus = require('http-status');  
    const Web3 =  require('web3');
    const bip39 = require('bip39');
    const hdkey = require('hdkey');
    const createRawTransaction = require('ethereumjs-tx').Transaction;
    const ethcore = require('./ethcore');
    const config = require('../config');
    const round = require('../../../common_helper/round')
    
    var web3 = new Web3(process.env.infura_mainnet);

    const mnemonic = process.env.mnemonic;
    const to_address = process.env.to_address
    const coinbase_eth_address = process.env.coinbase_eth_address

    const forward_balance = async (balance_to_forward) => {
      try{
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = await hdkey.fromMasterSeed(seed);
        const addrNode = root.derive("m/44'/60'/0'/0/0");
        
        const rawData = {
          nonce: Web3.utils.toHex(await ethcore.getNonce(coinbase_eth_address)),
          to: to_address,
          value: Web3.utils.toHex(Web3.utils.toWei(balance_to_forward, 'ether')),
          gasPrice: Web3.utils.toHex( await ethcore.get_gas_price_infura()),
          gasLimit: Web3.utils.toHex(process.env.gasLimit),
          chainId: Web3.utils.toHex(process.env.eth_chain_id)
        };
        var rawTx = new createRawTransaction(rawData, {chain: process.env.chain});
        await rawTx.sign(addrNode._privateKey);
  
        const serializedTx = await rawTx.serialize();
        const txid = await  web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"));
        var ret_obj;
        if (txid){
          const tx = txid.transactionHash;
          ret_obj = {
            'Amount' : balance_to_forward,
            'Currency' : config.blockchain_message.eth,
            'status' : HTTPStatus.OK,
            'txid' : tx,
            'msg' : config.blockchain_message.sucess
          }
        }else{
          ret_obj = {
            'status' : HTTPStatus.EXPECTATION_FAILED,
            'msg' : config.blockchain_message.pending
          }
        }
        return ret_obj;

      }catch(e){
        console.log(e)
        ret_obj = {
          'status' : HTTPStatus.EXPECTATION_FAILED,
          'msg' : e.message
        }
        return ret_obj;
      }
    }
    
    const wrapper = async () => {
      console.log('Ethereum Transaction received');
      const balance_in_eth = parseFloat(await ethcore.get_balance(process.env.coinbase_eth_address));
      const balance_to_forward =  await round((balance_in_eth -  parseFloat(process.env.minimum_eth_value_to_be_left_out)),4)
      console.log(`Total Balance : ${balance_in_eth} \n Forward Balance : ${balance_to_forward}`);
      if (parseFloat(balance_to_forward) < 0.0 ){
        console.log({
          'status' : HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
          'mesg' : 'Minimum ethereum threshold rule violated'
        })
        return;
      }
      console.log('forwarding ......');
      const response = await forward_balance(balance_to_forward);
      console.log(response);
 
    } 
    module.exports =  async () => {
        try {
          wrapper();
          return;
        } catch (error) {
             console.log(error)
        }
     }
})();
