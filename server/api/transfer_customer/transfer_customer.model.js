'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransferCustomer = new Schema({
  from_counter: Number,
  to_counter: Number,
  customer: String,
  queueing_number: String,
  gallery: String,
  status: String,
  date: String,
  time: String,
  note: String
},{
    timestamps: true
});

module.exports = mongoose.model('TransferCustomer', TransferCustomer);