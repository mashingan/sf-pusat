'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaggingTransaction = new Schema({
  tagging_code: String,
  level_1: String,
  level_2: String,
  level_3: String,
  level_4: String,
  sla : Number
},{
    timestamps: true
});

module.exports = mongoose.model('TaggingTransaction', TaggingTransaction);
