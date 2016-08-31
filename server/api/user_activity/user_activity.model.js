'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserActivitySchema = new Schema({
  modul: String,
  action: String,
  user: String
},{
    timestamps: true
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
