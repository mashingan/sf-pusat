'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProvinceSchema = new Schema({
  name: String
},{
    timestamps: true
});

module.exports = mongoose.model('Province', ProvinceSchema);
