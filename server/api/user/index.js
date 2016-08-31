'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/query/:limit/:page/:order/:filter', auth.isAuthenticated(), controller.list);
router.delete('/:id/:user', controller.destroy);
router.post('/deleteall/:user', controller.destroy_all);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/update', auth.isAuthenticated(), controller.update);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/logout/:id', controller.logout);
router.get('/status/online', controller.online_user);
router.post('/', controller.create);
router.post('/online_csr', controller.online_csr);
router.get('/delete_cover/:id', controller.delete_cover);
router.post('/local/sync', controller.localSync);

module.exports = router;
