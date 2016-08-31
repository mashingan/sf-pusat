//'use strict';

var express = require('express');
var controller = require('./seeding.controller');

var router = express.Router();

router.post('/:modelpath', controller.save);
router.delete('/:modelpath', controller.remove);

module.exports = router;
