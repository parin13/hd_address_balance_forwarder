(() => {
    const Web3 =  require('web3');
    var web3 = new Web3(process.env.infura_mainnet);
    
    const dai_abi = require('./contracts').daiAbi
    
    const DAI_INSTANCE = new web3.eth.Contract(dai_abi, process.env.dai_address);

    module.exports = {
        daiInstance : DAI_INSTANCE
    }
    
})();