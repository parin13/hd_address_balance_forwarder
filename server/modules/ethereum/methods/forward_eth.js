(()=>{
  'use strict';
    const HTTPStatus = require('http-status');  
    const Web3 =  require('web3');
    const bip39 = require('bip39');
    const hdkey = require('hdkey');
    const createRawTransaction = require('ethereumjs-tx').Transaction;
    const ethcore = require('./ethcore');
    const config = require('../config')
    
    var web3 = new Web3(process.env.infura_mainnet);

    const mnemonic = process.env.mnemonic;
    const to_address = process.env.to_address
    const coinbase_eth_address = process.env.coinbase_eth_address

    const forward_balance = async () => {
      try{
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = await hdkey.fromMasterSeed(seed);
        const addrNode = root.derive("m/44'/60'/0'/0/0");
        
        const rawData = {
          nonce: Web3.utils.toHex(await ethcore.getNonce(coinbase_eth_address)),
          to: to_address,
          value: Web3.utils.toHex(Web3.utils.toWei('0.002', 'ether')),
          gasPrice: Web3.utils.toHex( await ethcore.get_gas_price_infura()),
          gasLimit: Web3.utils.toHex(process.env.gasLimit),
          chainId: Web3.utils.toHex(process.env.eth_chain_id)
        };
        var rawTx = new createRawTransaction(rawData, {chain: 'mainnet'});
        await rawTx.sign(addrNode._privateKey);
  
        const serializedTx = await rawTx.serialize();
        const txid = await  web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"));
        var ret_obj;
        if (txid){
          const tx = txid.transactionHash;
          ret_obj = {
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
      }
    }

    module.exports =  async (req, res, next) => {
        try {          
          const balance_in_eth = await ethcore.get_balance(process.env.coinbase_eth_address)
          const response = await forward_balance();
          return res.json(response);
        } catch (error) {
             console.log(error)
        }
     }

})();