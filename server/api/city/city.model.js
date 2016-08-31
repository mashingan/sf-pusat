'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CitySchema = new Schema({
  name: String,
  province: String
},{
    timestamps: true
});

module.exports = mongoose.model('City', CitySchema);
