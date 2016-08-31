'use strict';

var express = require('express');
var controller = require('./customer.controller');

var router = express.Router();

router.get('/:limit/:page/:order/:filter', controller.index);
router.post('/', controller.create);
router.post('/mdn', controller.check_mdn);
router.post('/login', controller.login);
router.post('/update', controller.update);
router.post('/change_password', controller.changePassword);
router.post('/forgot_password', controller.forgotPassword);
router.post('/validate_recovery_code', controller.validateRecoveryCode);
router.post('/reset_password', controller.resetPassword);
router.get('/:id', controller.show);
router.get('/customer_stat/count', controller.customer_stat_count);
router.post('/verify_customer', controller.verify_customer);

module.exports = router;
