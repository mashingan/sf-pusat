/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Roles              ->  index
 * POST    /Roles              ->  create
 * GET     /Roles/:id          ->  show
 * PUT     /Roles/:id          ->  update
 * DELETE  /Roles/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var Role = require('./role.model');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;

exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable

};

// Get list of Roles
exports.index = function(req, res) {
  Role.find(function (err, roles) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(roles);
  });
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
  Role.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    Role.find({},function (err, roles) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_role': roles}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Role.find({}, function (err, roles) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_role': roles}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);

  }


};

// Get a single Role
exports.show = function(req, res) {
  Role.findById(req.params.id, function (err, role) {
    if(err) { return handleError(res, err); }
    if(!role) { return res.status(404).send('Not Found'); }
    return res.json(role);
  });
};

// Creates a new Role in the DB.
exports.create = function(req, res) {
  Role.create(req.body, function(err, role) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(role);
  });
};

// Updates an existing Role in the DB.
exports.update = function(req, res) {
  var name = String(req.body.name);
  var description = String(req.body.description);
  var id = String(req.body.id);

  Role.findById(id, function (err, role) {

      role.name = name;
      role.description = description;

      role.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });

  });
};

// Deletes a role from the DB.
exports.destroy = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  Role.findById(req.params.id, function (err, role) {
    if(err) { return handleError(res, err); }
    if(!role) { return res.status(404).send('Not Found'); }
    role.remove(function(err) {
      if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Role', action: 'Delete', user: req.params.user },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Role' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:role", ua_modul);
              
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
  var roles = req.body;
  var ua_dashboard = [];
  var ua_modul = [];

  for (var index in roles) {

      Role.findByIdAndRemove(roles[index]._id, function(err, role) {

      });

  }
  UserActivity.create({ modul : 'Role', action: 'Delete Multiple Row', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua,'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'Role' }, function (err, ua) {
         
          asyncLoop( 0, ua,'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:role", ua_modul);
            
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
