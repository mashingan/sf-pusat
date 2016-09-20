//'use strict';

var express = require('express');
var controller = require('./reporting.controller');

var router = express.Router();

router.get('/performance/:when/:where/:limit/:page',
    controller.performance);
router.get('/transaction/:when/:where/:who/:limit/:page',
    controller.transaction);
router.get('/customer/:when/:where/:limit/:page', controller.customer);
router.get('/productivity/:when/:where/:limit/:page',
    controller.productivity);

module.exports = router;
