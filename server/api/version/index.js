//'use strict';

var express = require('express');
var controller = require('./version.controller');

var router = express.Router();

router.get('/latest', controller.getVersion);
router.post('/upload', controller.uploadUpdate);
router.get('/download', controller.getLatest);

module.exports = router;
