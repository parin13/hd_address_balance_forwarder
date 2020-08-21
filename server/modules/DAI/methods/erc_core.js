( () => {
    const Web3 =  require('web3');    
    const common_helper = require('../../../common_helper');
    const web3 = new Web3(process.env.infura_mainnet);
    
    const getErcBalance = async (ercInstance, address) => {
        try {
            const balance_wei = await ercInstance.methods.balanceOf(address).call();
            const balance_dai = Web3.utils.fromWei(balance_wei, 'ether');
            return +balance_dai;                        
        } catch (error) {
            console.log(error);            
        }
    }


    const getNonce = async (address) => {
        return web3.eth.getTransactionCount(address)
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


    module.exports = {
        getErcBalance : getErcBalance,
        getNonce : getNonce,
        get_gas_price_infura : get_gas_price_infura
    }    
})();

