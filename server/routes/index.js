'use strict';
const express = require('express');
const router = express.Router();
const ethereum = require('../modules/ethereum');
const erc = require('../modules/DAI');

(() => {

  router.route('/forward_eth').post(ethereum.forwardEth);
  router.route('/forward_dai').post(erc.forwardDai);

  module.exports = router;
})();
