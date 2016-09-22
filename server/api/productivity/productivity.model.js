'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductivitySchema = new Schema({
  date:Date,
  gallery: String,
  region: String,
  customerTransaction:{
    walkIn:{type:Number,default:0},
    answer:{type:Number,default:0},
    answerPercentage:{type:Number,default:0},
    walkAway:{type:Number,default:0},
    walkAwayPercentage:{type:Number,default:0},
    waiting:{type:Number, default:0}
  },
  transactionTime:{
    total:{type:Number,default:0},
    average:{type:Number,default:0},
    maximum:{type:Number, default:0},
    minimum:{type:Number, default:0}
  },
  waitingTime10:{
    average:{type:Number,default:0},
    ltSL:{type:Number,default:0},
    ltSLPercentage:{type:Number,default:0},
    gtSL:{type:Number,default:0},
    gtSLPercentage:{type:Number,default:0},
    max:{type:Number,default:0}
  },
  waitingTime15:{
    average:{type:Number,default:0},
    ltSL:{type:Number,default:0},
    ltSLPercentage:{type:Number,default:0},
    gtSL:{type:Number,default:0},
    gtSLPercentage:{type:Number,default:0},
    max:{type:Number,default:0}
  }
});

module.exports = mongoose.model('Productivity', ProductivitySchema);
