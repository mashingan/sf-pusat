'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var CustomerTicketSchema = new Schema({
  
  ticket_type: String,
  book_code: String,
  gallery: String,
  date: Date,
  time: String,
  note: String,
  mdn: String,
  type_of_service: String,
  customer: String,
  picture: String,
  status: String,
  status_pending: Boolean,
  queueing_number: Number,
  counter: String,
  is_skipped: Boolean,
  skipped_number: Number

},{
    timestamps: true
});

module.exports = mongoose.model('CustomerTicket', CustomerTicketSchema);
