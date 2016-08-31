'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentTransactionSchema = new Schema({
  date: Date,
  agent: String,
  gallery: String,
  time: timestamp,
  book_code: String,
  over_time: String
},{
    timestamps: true
});

module.exports = mongoose.model('AgentProductitvity', AgentTransactionSchema);