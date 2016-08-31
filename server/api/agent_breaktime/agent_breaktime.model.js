'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentbreaktimeSchema = new Schema({
  nik: String,
  agent: String,
  type_of_breaktime: String,
  date: Date,
  start_time: String,
  end_time: String,
  duration: String	
},{
    timestamps: true
});

module.exports = mongoose.model('Agentbreaktime', AgentbreaktimeSchema);
