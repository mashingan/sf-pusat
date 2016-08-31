'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
  name: String,
  scope: String,
  key: String,
  value: String
},{
    timestamps: true
});

module.exports = mongoose.model('Configuration', ConfigurationSchema);
