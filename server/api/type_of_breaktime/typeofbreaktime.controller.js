'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Typeofbreaktime = require('./typeofbreaktime.model');
var moment = require('moment');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;

exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable

};

exports.index = function(req, res) {
  
  var re = new RegExp(req.params.filter, 'i');
  var filter = [
    { 'name': { $regex: re }}
  ];
  var data = [];

  if(req.params.filter!='-'){
    Typeofbreaktime.find({},function (err, typeofbreaktimes) {
      if(err) { return handleError(res, err); }

      if(typeofbreaktimes.length > 0){

        for(var i=0; i < typeofbreaktimes.length; i++){

          data.push(typeofbreaktimes[i].name);

        }

      }
      return res.status(200).json(data);
    }).or(filter);
  }else{
    Typeofbreaktime.find({},function (err, typeofbreaktimes) {
      if(err) { return handleError(res, err); }

      if(typeofbreaktimes.length > 0){

        for(var i=0; i < typeofbreaktimes.length; i++){

          data.push(typeofbreaktimes[i].name);

        }

      }
      return res.status(200).json(data);
    });
  }
  

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

  var c;
  Typeofbreaktime.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    Typeofbreaktime.find({},function (err, typeofbreaktimes) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_typeofbreaktime': typeofbreaktimes}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Typeofbreaktime.find({}, function (err, typeofbreaktimes) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_typeofbreaktime': typeofbreaktimes}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }


};

// Get a single typeofservice
exports.show = function(req, res) {
  Typeofbreaktime.findById(req.params.id, function (err, typeofbreaktime) {
    if(err) { return handleError(res, err); }
    if(!typeofbreaktime) { return res.status(404).send('Not Found'); }
    return res.json(typeofbreaktime);
  });
};

// Creates a new typeofservice in the DB.
exports.create = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  Typeofbreaktime.create(req.body, function(err, typeofbreaktime) {
    if(err) { return handleError(res, err); }
    UserActivity.create({ modul : 'Type Of Breaktime', action: 'Create', user: req.body.user_op },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua, 'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'Type Of Breaktime' }, function (err, ua) {
         
          asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:type_of_breaktime", ua_modul);

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);  

    });
    return res.status(201).json(typeofbreaktime);
  });
  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 
};

// Updates an existing typeofservice in the DB.
exports.update = function(req, res) {
  var name = String(req.body.name);
  var time = String(req.body.time);
  var id = String(req.body.id);
  var ua_dashboard = [];
  var ua_modul = [];
  Typeofbreaktime.findById(id, function (err, typeofservice) {

      typeofservice.name = name;
      typeofservice.time = time;

      typeofservice.save(function(err) {
        if (err) return validationError(res, err);

        UserActivity.create({ modul : 'Type Of Breaktime', action: 'Update', user: req.body.user_op },function(err, log){

            /* find log activity then update data on dashboard */
            UserActivity.find({}, function (err, ua) {
               
                asyncLoop( 0, ua,'dashboard', function(){

                    /* send info to socket */
                    Socket.emit("activity:user", ua_dashboard); 

                  
                });

            }).sort({ createdAt : -1 })
              .limit(5);

            /* find log activity then update data on modul activity */
            UserActivity.find({modul: 'Type Of Breaktime' }, function (err, ua) {
               
                asyncLoop( 0, ua,'modul', function(){

                  /* send info to socket */
                  Socket.emit("activity:modul:type_of_breaktime", ua_modul);
                  
                });

            }).sort({ createdAt : -1 })
              .limit(5);  

        });

        res.status(200).send('OK');
      });

  });
  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 
};

// Deletes a typeofservice from the DB.
exports.destroy = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  Typeofbreaktime.findById(req.params.id, function (err, typeofbreaktime) {
    if(err) { return handleError(res, err); }
    if(!typeofbreaktime) { return res.status(404).send('Not Found'); }
    typeofbreaktime.remove(function(err) {
      if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Type Of Breaktime', action: 'Delete', user: req.params.user },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({ modul: 'Type Of Breaktime' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:type_of_breaktime", ua_modul);
              
            });

        }).sort({ createdAt : -1 })
          .limit(5);  

      });
      return res.status(204).send('No Content');
    });
  });
  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 
};
exports.destroy_all = function(req, res) {
  var typeofbreaktimes = req.body;
  var ua_dashboard = [];
  var ua_modul = [];

  for (var index in typeofbreaktimes) {

      Typeofbreaktime.findByIdAndRemove(typeofbreaktimes[index]._id, function(err, handsettype) {

      });
  }
  UserActivity.create({ modul : 'Type Of Breaktime', action: 'Delete Multiple Row', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua,'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'Type Of Breaktime' }, function (err, ua) {
         
          asyncLoop( 0, ua,'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:type_of_breaktime", ua_modul);
            
          });

      }).sort({ createdAt : -1 })
        .limit(5);  

  });

  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 

  return res.status(204).send('No Content');

};
function handleError(res, err) {
  return res.status(500).send(err);
}
