'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GalleryImprovementSchema = new Schema({
  
  gallery: String,
  counter_count: Number,
  agent_count: Number,
  update_on: Date
  
});

module.exports = mongoose.model('GalleryImprovement', GalleryImprovementSchema);