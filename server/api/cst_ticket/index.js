'use strict';

var express = require('express');
var controller = require('./cst_ticket.controller');

var router = express.Router();

router.get('/:limit/:page/:order/:filter', controller.index);
router.post('/book', controller.book);
router.get('/customer_booklist/:limit/:page/:order/:filter/:customer_id', controller.customer_booklist);
router.post('/queueing_chart', controller.queueing_chart);
router.post('/customer_chart', controller.customer_chart);
router.post('/kiosk_new_customer', controller.kiosk_new_customer);
router.post('/kiosk_bookcode', controller.kiosk_reg_via_bookcode);
router.post('/tv_display_counter_list', controller.counter_list);
router.post('/tv_display_queue_list', controller.queue_list);
router.post('/agent_current_customer', controller.agent_current_customer);
router.post('/agent_next_customer', controller.agent_next_customer);
router.post('/agent_recall_customer', controller.agent_recall_customer);
router.post('/agent_call_customer', controller.agent_call_customer);
router.post('/agent_noshow_customer', controller.agent_noshow_customer);
router.post('/agent_repeat_customer', controller.agent_repeat_customer);
router.get('/agent_waiting_list', controller.agent_waiting_list);
router.post('/postpone', controller.postpone);
router.post('/book_canceling', controller.book_canceling);
router.get('/notif/:book_code', controller.notif);
router.get('/ticket_stat/count', controller.ticket_stat_count);
router.get('/transaction_stat/count', controller.transaction_stat_count);
router.get('/rpt_productivity_national/:limit/:page/:order/:filter', controller.rpt_productivity_national);
router.get('/rpt_productivity_gallery/:limit/:page/:order', controller.rpt_productivity_gallery);
router.get('/rpt_queueing_transaction/:limit/:page/:order', controller.rpt_queueing_transaction);
router.get('/rpt_type_of_service_transaction/:limit/:page/:order', controller.rpt_type_of_service_transaction);
router.get('/rpt_transaction_exceeding_sla/:limit/:page/:order', controller.rpt_transaction_exceeding_sla);

router.post('/local/sync',controller.localSync);

module.exports = router;
