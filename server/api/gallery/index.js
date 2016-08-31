'use strict';

var express = require('express');
var controller = require('./gallery.controller');

var router = express.Router();

router.get('/:limit/:page/:order/:filter', controller.index);
router.get('/:id', controller.show);
router.get('/by_name/:name', controller.show_by_name);
router.get('/gallery/open', controller.gallery_open);
router.post('/gallery/set_open', controller.set_gallery_open);
router.get('/gallery_stat/count', controller.gallery_stat_count);
router.post('/', controller.create);
router.get('/socket_test/data', controller.socket_test);
router.post('/socket_test_update/data', controller.socket_test_update);
router.delete('/:id/:user', controller.destroy);
router.get('/query/:limit/:page/:order/:filter', controller.list);
router.post('/near_me', controller.near_me);
router.get('/delete_cover/:cover_index/:id', controller.delete_cover);
router.post('/deleteall/:user', controller.destroy_all);
router.post('/update', controller.update);

router.get('/local/sync/:id',controller.localSync);

module.exports = router;
