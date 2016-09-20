'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoggingSchema = new Schema({
  date: Date,       //
  nik: String,
  name: String,
  activity: String, // whether login, logout, taking breaktime
  time: Date,       // time when the user do the activity
  duration: {
    type: String,   // in string minutes, when the user taking breaktime
    default: '0'
  },
});


module.exports = mongoose.model('UserLogging', LoggingSchema);
