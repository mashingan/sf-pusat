'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TOS = require('../type_of_service/typeofservice.model');
var TosSchema = TOS.schema;

var GallerySchema = new Schema({
  name: String,
  ipAddress: String,
  address: String,
  picture: Array,
  location: {
    type: [Number],
    index: '2d'      
  },
  region: String,
  city: String,
  province: String,
  open_days: Array,
  is_opened: Boolean,
  active: Boolean,
  counter_count: Number,
  running_text: String,
  promo: String,
  type_of_service: [TosSchema]
},{
    timestamps: true
});

module.exports = mongoose.model('Gallery', GallerySchema);
