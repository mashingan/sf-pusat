'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var CustomerTicketSchema = new Schema({

  ticket_type: String,
  book_code: String,
  is_printed:{type:Boolean,default:false},
  printedAt: {type:Date,default:Date.now},
  gallery: String,
  date: Date,
  time: String,
  note: String,
  type_of_service: String,
  customer: String,
  picture: String,
  mdn:String,
  status: String,
  status_pending: Boolean,
  queueing_number: Number,
  ticket_number:String,
  counter: String,
  is_skipped: Boolean,
  skipped_number: Number,
  sync:{type:Boolean, default:false},
  email:String,
  proceedBy:{
    nik:String,
    role:String
  },
  isPostponed:Boolean,
  smsNotify:{type:Boolean,default:false},
  transaction:{
    proceedAt:Date,
    closedAt:Date
  }

},{
    timestamps: true
});

module.exports = mongoose.model('CustomerTicket', CustomerTicketSchema);
