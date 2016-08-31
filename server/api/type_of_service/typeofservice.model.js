'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TypeofserviceSchema = new Schema({
  name: String,
  tag: String, 
  description: String,
  active: Boolean,
  sla: { type: Number, default: 5 }
},{
    timestamps: true
});

module.exports = mongoose.model('Typeofservice', TypeofserviceSchema);
