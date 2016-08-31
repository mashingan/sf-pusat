var express = require('express');
var router = express.Router();
var controller = require('./sms.controller');

router.get('/greet', controller.greeting);
router.post('/greet', controller.newGreeting);

router.get('/notify', controller.notification);
router.post('/notify', controller.newNotification);

router.post('/create', controller.createMessage);
router.delete('/', controller.clearAll);

module.exports = router;
