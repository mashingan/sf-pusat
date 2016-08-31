'use strict';

var express = require('express');
var controller = require('./agent_breaktime.controller');

var router = express.Router();

router.get('/show/:id', controller.show);
router.post('/update', controller.update);
router.post('/', controller.create);
router.get('/query/:limit/:page/:order/:filter', controller.list);

module.exports = router;
