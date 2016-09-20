var customer = require('../customer/customer.model');
var cst_ticket = require('../cst_ticket/cst_ticket.model');
var customer_tagging_transaction = require('../customer_tagging_transaction/customer_tagging_transaction.model');
var gallery = require('../gallery/gallery.model');
var role = require('../role/role.model');
var tagging_transaction = require('../tagging_transaction/tagging_transaction.model');
var typeofbreaktime = require('../type_of_breaktime/typeofbreaktime.model');
var typeofservice = require('../type_of_service/typeofservice.model');
var user = require('../user/user.model');
var agent_breaktime = require('../agent_breaktime/agent_breaktime.model');
var productivity = require('../productivity/productivity.model');

var Models = {
  customer: customer,
  cst_ticket: cst_ticket,
  customer_tagging_transaction: customer_tagging_transaction,
  gallery: gallery,
  role: role,
  tagging_transaction: tagging_transaction,
  typeofbreaktime: typeofbreaktime,
  typeofservice: typeofservice,
  user: user,
  agent_breaktime: agent_breaktime,
  productivity: productivity
};

module.exports.save = function (req, res) {
  console.log(req.params.modelpath);
  var modelpath = req.params.modelpath;
  var Model = Models[modelpath];
  if (!Model)
    return res.status(404).json({
      result: 'failed',
      message: 'incorrect db collection'
    });


  console.log(req.body.entry);
  Model.create(req.body.entry, function (err, docs) {
    if (err) {
      console.log(err.message);
      return res.status(404).json({
        result: 'failed',
        message: 'cannot save the data'
      });
    }
    res.status(200).json({
      result: 'success',
      message: 'saving to ' + modelpath + ' collection success'
    });

  });
  //res.status(200).json({ status: 'success' });
};

module.exports.remove = function (req, res) {
  console.log(req.params.modelpath);
  var modelpath = req.params.modelpath;
  var Model = Models[modelpath];
  if (!Model)
    return res.status(404).json({
      result: 'failed',
      message: 'Incorrect db collection'
    });

  Model.remove({}, function (err, result) {
    if (err) return res.status(404).json({
      result: 'failed',
      message: err.message
    });
    res.status(200).json({
      result: 'success',
      message: 'drop ' + modelpath + ' collection succeed'
    });
  });
};
