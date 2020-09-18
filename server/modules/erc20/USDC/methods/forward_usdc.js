(()=>{
    'use strict';
      const HTTPStatus = require('http-status');  
      const Web3 =  require('web3');
      const bip39 = require('bip39');
      const hdkey = require('hdkey');
      const ercCore = require('../../common/erc_core');
      const config = require('../config');
      const round = require('../../../../common_helper/round');
      
      var web3 = new Web3(process.env.infura_mainnet);
  
      const mnemonic = process.env.mnemonic;
      const to_address = process.env.to_address
      const coinbase_eth_address = process.env.coinbase_eth_address
      const usdcInstance = require('../../../../contract/contract_instance').usdcInstace;
 
      const forward_balance = async (balance_to_forward) => {
        try{
          const forward_bal = Web3.utils.toWei(balance_to_forward,'ether');

          const seed = await bip39.mnemonicToSeed(mnemonic);
          const root = await hdkey.fromMasterSeed(seed);
          const addrNode = root.derive("m/44'/60'/0'/0/0");
          
          const rawData = {
            nonce: Web3.utils.toHex(await ercCore.getNonce(coinbase_eth_address)),
            to: process.env.usdc_address,
            data : usdcInstance.methods.transfer(to_address, forward_bal).encodeABI(),
            gasPrice: Web3.utils.toHex( await ercCore.get_gas_price_infura()),
            gasLimit: Web3.utils.toHex(process.env.gasLimit)
          };

          const txid = await ercCore.sign_and_send_transaction(rawData, addrNode._privateKey);

          var ret_obj;
          if (txid){
            const tx = txid.transactionHash;
            ret_obj = {
              'Amount' : balance_to_forward,
              'Currency' : config.blockchain_message.usdc,
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
  
      module.exports =  async (req, res, next) => {
          try {
            const balance_in_usdc = await ercCore.getErcBalance(usdcInstance, to_address);
            const balance_to_forward =  await round((balance_in_usdc -  parseFloat(process.env.minimum_usdc_value_to_be_left_out)),4)
            console.log(`Total USDC Balance : ${balance_in_usdc} \n Forward Balance : ${balance_to_forward}`)
            if (parseFloat(balance_to_forward) < 0.0 ){
              return res.json({
                'status' : HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
                'mesg' : 'Minimum USDC threshold rule violated'
              })
            }
            console.log('forwarding ......');
            const response = await forward_balance(balance_to_forward);
            console.log(response);
            return res.json(response);
          } catch (error) {
               console.log(error)
          }
       }
  
  })();