'use strict';

var express = require('express');
var controller = require('./customer_tagging_transaction.controller');

var router = express.Router();

router.post('/save', controller.create);
router.post('/closed', controller.close_transaction);

router.post('/local/sync',controller.localSync);

module.exports = router;
