'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SmsCodeSchema = new Schema({
  customer: String,
  code: String,
  status: String
});

module.exports = mongoose.model('SmsCode', SmsCodeSchema);