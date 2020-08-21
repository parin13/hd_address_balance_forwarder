/* eslint-disable camelcase */
(() => {
    'use strict';
    const Web3 =  require('web3');
    const bip39 = require('bip39');
    const hdkey = require('hdkey');
    const ethUtil = require('ethereumjs-util');


    const common_helper = require('../../../common_helper');

    var web3 = new Web3(process.env.infura_mainnet);

    const mnemonic = process.env.mnemonic;
  
    function getAddress(){
      return new Promise( async (resolve, reject) => {
        try {
            const seed = await bip39.mnemonicToSeed(mnemonic);
            const root = await hdkey.fromMasterSeed(seed);
            const masterPrivateKey = root.privateKey.toString('hex');           
            const addrNode = root.derive("m/44'/60'/0'/0/0");
            const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
            const addr = '0x'+ethUtil.publicToAddress(pubKey).toString('hex');
            const address = ethUtil.toChecksumAddress(addr);

            resolve (address);
        } catch (error) {
          reject(error);
        }
      });
    }

    const getNonce = async (address) => {
        return web3.eth.getTransactionCount(address)
    }

    const get_balance = async (address) => {
      var balance_wei = await web3.eth.getBalance(address);
      const balance_eth = Web3.utils.fromWei(balance_wei, 'ether')
      return balance_eth;
    }

    const get_gas_price_infura = async () => {
        var headers = {
          'Content-Type': 'application/json'
        };
        var dataString = '{"jsonrpc":"2.0","method":"eth_gasPrice","params": [],"id":1}';

        var options = {
          url: process.env.infura_mainnet,
          method: 'POST',
          headers: headers,
          body: dataString
        };
        
        const infura_response = await common_helper.request(options);
        const network_gas_price_wei =  web3.utils.hexToNumber(infura_response.result) + parseInt(process.env.addition_gas_price_wei); 
        return network_gas_price_wei;
    }

    module.exports ={
        getAddress : getAddress,
        getNonce : getNonce,
        get_balance : get_balance,
        get_gas_price_infura : get_gas_price_infura
    }
  })();
  