'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Agentbreaktime = require('./agent_breaktime.model');
var moment = require('moment');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;

exports.socketHandler = function (socket, socketio) {

    Socket = socketio; 

};

exports.index = function(req, res) {
  

};

exports.list = function(req, res) {

  var limit = req.params.limit;
  var page = req.params.page;
  var order = req.params.order;
  var offset = (page-1) * limit;
  var re = new RegExp(req.params.filter, 'i');
  var filter = [
    { 'name': { $regex: re }}
  ];
  var data =[];
  var c;
  Agentbreaktime.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    Agentbreaktime.find({},function (err, agent_breaktimes) {
      if(err) return res.status(500).send(err);
      for(var i=0;i < agent_breaktimes.length;i++){
        data.push({
          date : moment(agent_breaktimes[i].date).format('DD-MM-YYYY'),
          nik : agent_breaktimes[i].nik,
          agent : agent_breaktimes[i].agent,
          type_of_breaktime : agent_breaktimes[i].type_of_breaktime,
          start_time : agent_breaktimes[i].start_time,
          end_time : agent_breaktimes[i].end_time,
          duration : agent_breaktimes[i].duration
        });
      }
      var j = [{'count':c, 'data_agent_breaktime': data}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Agentbreaktime.find({}, function (err, agent_breaktimes) {
      if(err) return res.status(500).send(err);
      for(var i=0;i < agent_breaktimes.length;i++){
        data.push({
          date : moment(agent_breaktimes[i].date).format('DD-MM-YYYY'),
          nik : agent_breaktimes[i].nik,
          agent : agent_breaktimes[i].agent,
          type_of_breaktime : agent_breaktimes[i].type_of_breaktime,
          start_time : agent_breaktimes[i].start_time,
          end_time : agent_breaktimes[i].end_time,
          duration : agent_breaktimes[i].duration
        });
      }
      var j = [{'count':c, 'data_agent_breaktime': data}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }

};

exports.show = function(req, res) {
  Agentbreaktime.findById(req.params.id, function (err, typeofbreaktime) {
    if(err) { return handleError(res, err); }
    if(!typeofbreaktime) { return res.status(404).send('Not Found'); }
    return res.json(typeofbreaktime);
  });
};


exports.create = function(req, res) {
  
  Agentbreaktime.create(req.body, function(err, agentbreaktime) {

    if(err) { return handleError(res, err); }
    return res.status(201).json(agentbreaktime);
  
  });
 
};


exports.update = function(req, res) {
  
  var date = req.body.date;
  var nik = req.body.nik;
  var type_of_breaktime = req.body.type_of_breaktime;
  var agent = req.body.agent;
  var end_time = req.body.end_time;
  var duration = req.body.duration;

  Agentbreaktime.findOne({ 
    date: {
                $gte: date,
                $lt: moment(date).add(1, 'days')
          }, 
    nik:nik, 
    type_of_breaktime:type_of_breaktime, 
    agent:agent
  }, function(err, agentbreaktime) {

    if(agentbreaktime){

      agentbreaktime.end_time = end_time;
      agentbreaktime.duration = duration;

      agentbreaktime.save(function(){

         return res.status(200).json({ result: "success", message: "Successfully update agent breaktime data."});

      });

    }else{

      return res.status(200).json({ result: "failed", message: "No data found"});
    
    }
    
   
  
  });

};


exports.destroy = function(req, res) {
  
  
};
exports.destroy_all = function(req, res) {
  

};
function handleError(res, err) {
  return res.status(500).send(err);
}
