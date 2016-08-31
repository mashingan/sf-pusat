'use strict';

var _ = require('lodash');
var TransferCustomer = require('./transfer_customer.model');
var Gallery = require('../gallery/gallery.model');
var moment = require('moment');
var Socket = null;


exports.socketHandler = function (socket,socketio) {

    Socket = socketio; // attaching Socket to variable
};

exports.index = function(req, res) {
  
};
exports.list = function(req, res) {
  
};

exports.show = function(req, res) {
 
};

exports.create = function(req, res) {
  var from_counter = req.body.from_counter;
  var to_counter = req.body.to_counter;
  var customer = req.body.customer;
  var gallery = req.body.gallery;
  var queueing_number = req.body.queueing_number;
  var note = req.body.note;
  var datenow = moment().format('YYYY-MM-DD');
  var timenow = moment().format('HH:mm');

  TransferCustomer.create({ 
    from_counter: from_counter, 
    to_counter: to_counter, 
    customer: customer, 
    gallery: gallery, 
    queueing_number:queueing_number, 
    note: note, 
    date: datenow, 
    time:timenow
  },function(err, tc){

      if(err){ return res.status(200).json({ result: "failed", message: "Server Error", log: err}) }

      if(tc){

        TransferCustomer.find({to_counter: to_counter},function(err, data){

          Gallery.findOne({name : gallery},function(err, gal){

            Socket.emit('agent:incoming_transfer_customer:'+gal._id+':' + to_counter , data);

            return res.status(200).json({ result: "success", message: "Transfer success!"});

          });

        });
        
      }  

  });

};

exports.update = function(req, res) {
 
};

exports.destroy = function(req, res) {
  
};

function handleError(res, err) {
  return res.status(500).send(err);
}
