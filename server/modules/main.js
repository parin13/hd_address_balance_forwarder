(() => {
    'use strict';
    const HTTPStatus = require('http-status');  
    const eth = require('./ethereum');
    const erc = require('./erc20');

    const wrapper = async (req) => {
        try{
            const post_data = req.body;
            console.log('>>>>>>>>>>>>coinase request \n\n ',post_data);
            const payment_detail = post_data.event.data.payments[0];
            const detail = payment_detail.value.crypto;
            const crypto = detail.currency;
            const amount = detail.amount;
            console.log(">>>>>>>>>>>>>>>>>>> transction Received <<<<<<<<<<<< :: ", amount, crypto);
            if (crypto == 'ETH'){
                eth.forwardEth()
            }
            else if( crypto == 'DAI'){
                erc.dai.forwardDai();
    
            }else if(crypto == 'USDC'){
                erc.usdc.forwardUsdc();
            }else{
              return;    
            }
        }catch(error){
            console.log(error);
        }

    }

    module.exports =  async (req, res, next) => {
        try {
            wrapper(req);
          return res.json({
            'status' : HTTPStatus.OK
          });
        } catch (error) {
             console.log(error)
        }
     }

})();