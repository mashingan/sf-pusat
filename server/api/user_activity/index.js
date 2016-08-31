'use strict';

var express = require('express');
var controller = require('./user_activity.controller');

var router = express.Router();

router.post('/', controller.create);
router.get('/', controller.show);
router.get('/modul/:modul', controller.show_by_modul);

module.exports = router;
