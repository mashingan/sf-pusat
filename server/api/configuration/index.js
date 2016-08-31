'use strict';

var express = require('express');
var controller = require('./configuration.controller');

var router = express.Router();

router.get('/smtp_config', controller.smtp_config);
router.post('/smtp_config_update', controller.smtp_config_update);
router.get('/email_template', controller.email_template);
router.post('/email_template_update', controller.email_template_update);
router.get('/email_activation_template', controller.email_activation_template);
router.post('/email_activation_template_update', controller.email_activation_template_update);
router.get('/zsmart_api_config', controller.zsmart_api_config);
router.post('/zsmart_api_config_update', controller.zsmart_api_config_update);
router.get('/gallery_config', controller.gallery_config);
router.post('/gallery_config_update', controller.gallery_config_update);

// Adding hardcoded version for now
router.get('/version', controller.getVersion);
router.post('/version', controller.putVersion);

module.exports = router;
