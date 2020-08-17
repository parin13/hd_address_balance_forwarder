'use strict';
const express = require('express');
const router = express.Router();
const ethereum = require('../modules/ethereum');

(() => {

  router.route('/forward_eth').post(ethereum.forwardEth);

  module.exports = router;
})();
