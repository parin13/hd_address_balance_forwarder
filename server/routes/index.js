'use strict';
const express = require('express');
const router = express.Router();
const main = require('../modules/main')
const eth = require('../modules/ethereum');
const erc = require('../modules/erc20');

(() => {
  router.route('/balance_forwarder').post(main);
  // router.route('/balance_forwarder').post(eth.forwardEth);
  router.route('/forward_eth').post(eth.forwardEth);
  router.route('/forward_dai').post(erc.dai.forwardDai);
  router.route('/forward_usdc').post(erc.usdc.forwardUsdc);

  module.exports = router;
})();
