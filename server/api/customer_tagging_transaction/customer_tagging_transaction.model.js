'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerTaggingTransaction = new Schema({
  tagging_code: String,
  customer: String,
  queueing_number: String,
  agent: String,
  date: Date,
  time: String,
  gallery:String,
  counter:Number,
  duration:String,
  exceeding_sla: {
    
    type: Boolean,
    default: false

  }
},{
    timestamps: true
});

module.exports = mongoose.model('CustomerTaggingTransaction', CustomerTaggingTransaction);