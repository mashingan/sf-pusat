/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/gallery_improvements', require('./api/gallery_improvement'));
  app.use('/api/agent_breaktimes', require('./api/agent_breaktime'));
  app.use('/api/agent_transactions', require('./api/agent_transaction'));
  app.use('/api/agent_productivitys', require('./api/agent_productivity'));
  app.use('/api/tagging_transactions', require('./api/tagging_transaction'));
  app.use('/api/transfer_customers', require('./api/transfer_customer'));
  app.use('/api/customer_tagging_transactions', require('./api/customer_tagging_transaction'));
  app.use('/api/cst_tickets', require('./api/cst_ticket'));
  app.use('/api/handset_types', require('./api/handset_type'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/user_activities', require('./api/user_activity'));
  app.use('/api/galleries', require('./api/gallery'));
  app.use('/api/provinces', require('./api/province'));
  app.use('/api/cities', require('./api/city'));
  app.use('/api/typeofservices', require('./api/type_of_service'));
  app.use('/api/typeofbreaktimes', require('./api/type_of_breaktime'));
  app.use('/api/roles', require('./api/role'));
  app.use('/api/configurations', require('./api/configuration'));
  app.use('/api/sms_gateway', require('./api/sms_gateaway'));
  app.use('/api/env', require('./api/env'));
  app.use('/api/sms', require('./api/sms'));
  app.use('/api/seeding', require('./api/seeding'));
  app.use('/api/version', require('./api/version'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
