(()=>{
    const Web3 =  require('web3');
    const bip39 = require('bip39');
    const hdkey = require('hdkey');
    const ethUtil = require('ethereumjs-util');
    const createRawTransaction = require('ethereumjs-tx').Transaction;
    
    const infura_ropsten =  "https://mainnet.infura.io/v3/1e796d93d36f4bf08797a67cf289f38f";

    var web3 = new Web3(infura_ropsten);

    const mnemonic = 'coast wood ritual speak once deny curve reason width attend latin myth';
    const metamask_address = '0x60826fE5dc00bC752C8D4DeB040d22392A42b9dD';
    const coinbase_eth_address = '0x007444f5dfd08c6b5f1fa228f9f456ed3cee83ce';

    const getAddress = async() => {

      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = await hdkey.fromMasterSeed(seed);
      const masterPrivateKey = root.privateKey.toString('hex');
     
      const addrNode = root.derive("m/44'/60'/0'/0/0");
      const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
      const addr = '0x'+ethUtil.publicToAddress(pubKey).toString('hex');
      const address = ethUtil.toChecksumAddress(addr);
      return address;
    }

    const getNonce = async (address) => {
      return web3.eth.getTransactionCount(address)
    }

    const check_balance = async (address) => {
      var balance_wei = web3.eth.getBalance(address);
      return balance_wei;
    }

    const forward_balance = async () => {
      try{
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = await hdkey.fromMasterSeed(seed);
        const addrNode = root.derive("m/44'/60'/0'/0/0");
  
        const rawData = {
          nonce: Web3.utils.toHex(await getNonce(coinbase_eth_address)),
          to: metamask_address,
          value: Web3.utils.toHex(Web3.utils.toWei('0.002', 'ether')),
          gasPrice: 0x11ed8ec200,
          gasLimit: Web3.utils.toHex(100000),
          chainId: Web3.utils.toHex(1)
        };
        var rawTx = new createRawTransaction(rawData, {chain: 'mainnet'});
        await rawTx.sign(addrNode._privateKey);
  
        const serializedTx = await rawTx.serialize();
        const txid = await  web3.eth.sendSignedTransaction('0x' + serializedTx.toString("hex"));
        console.log(txid.transactionHash);
        return txid;
  
      }catch(e){
        console.log(e)
      }


    }

    module.exports =  async (req, res, next) => {
        try {
          const seed = await bip39.mnemonicToSeed(mnemonic);
          const root = await hdkey.fromMasterSeed(seed);
          const addrNode = root.derive("m/44'/60'/0'/0/0");
          
          const txid = await forward_balance();

          console.log(txid);

        } catch (error) {
             console.log(error)
        }
     }

})();