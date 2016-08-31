var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SMS = new Schema ({
  type: { type: String, unique: true },
  message: String   // free text
});

module.exports = mongoose.model('SMS', SMS);
