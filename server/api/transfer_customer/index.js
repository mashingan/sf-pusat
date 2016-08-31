'use strict';

var express = require('express');
var controller = require('./transfer_customer.controller');

var router = express.Router();

router.post('/save', controller.create);

module.exports = router;
