'use strict';

var express = require('express');
var controller = require('./env.controller');
var router = express.Router();

router.get('/is_server_online', controller.check_master_server);
router.get('/ping', controller.ping);

module.exports = router;
