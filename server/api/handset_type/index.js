'use strict';

var express = require('express');
var controller = require('./handset_type.controller');

var router = express.Router();

router.get('/:limit/:page/:order/:filter', controller.index);
router.get('/:filter', controller.index);
router.get('/show/:id', controller.show);
router.get('/query/:limit/:page/:order/:filter', controller.list);
router.post('/update', controller.update);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id/:user', controller.destroy);
router.post('/deleteall/:user', controller.destroy_all);

module.exports = router;
