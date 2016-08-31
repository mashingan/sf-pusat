'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HandsetTypeSchema = new Schema({
  name: String
},{
    timestamps: true
});

module.exports = mongoose.model('HansetType', HandsetTypeSchema);