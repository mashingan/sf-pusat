'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var VersionSchema = new Schema({
  
  version: String,
  filepath: String


},{
    timestamps: true
});

module.exports = mongoose.model('Version', VersionSchema);
