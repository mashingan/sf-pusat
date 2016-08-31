'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TypeofbreaktimeSchema = new Schema({
  name: String,
  time: Number
},{
    timestamps: true
});

module.exports = mongoose.model('Typeofbreaktime', TypeofbreaktimeSchema);
