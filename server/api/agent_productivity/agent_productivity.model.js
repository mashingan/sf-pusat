'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentProductitvitySchema = new Schema({
  date: Date,
  agent: String,
  gallery: String,
  loginstamp: timestamp,
  logoutstamp: timestamp,
  customer_served: String,
  customer_unserved: String,
  status: String,
  total_queueing_number: Int
},{
    timestamps: true
});

module.exports = mongoose.model('AgentProductitvity', AgentProductitvitySchema);