'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var UserActivity = require('./user_activity.model');
var User = require('../user/user.model');
var moment = require('moment');
var Socket = null;

exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable
};

// Get list of provinces
exports.index = function(req, res) {


};

exports.list = function(req, res) {


  
};

exports.show = function(req, res) {
  
  var data = [];

  UserActivity.find({}, function (err, ua) {

    if(err){
      res.status(200).json({ result: "failed", message : "Server Error", log: err});
    }else{
     
    	asyncLoop( 0, ua, function(){

      		return res.status(200).json(data);	
      	
      	});

    }

  }).sort({ createdAt : -1 })
    .limit(5);

  function asyncLoop( i, ua, callback ) {

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

                  data.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });

                   asyncLoop( i+1, ua, callback );

              });

            }else{


              data.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

              asyncLoop( i+1, ua, callback );

            }

          });
      
      	} else {

          callback();
      
      	}
  } 
};
exports.show_by_modul = function(req, res) {
  
  var data = [];
  var modul = req.params.modul;

  UserActivity.find({modul : modul}, function (err, ua) {

    if(err){
      res.status(200).json({ result: "failed", message : "Server Error", log: err});
    }else{
     
      asyncLoop( 0, ua, function(){

          return res.status(200).json(data);  
        
        });

    }

  }).sort({ createdAt : -1 })
    .limit(5);

  function asyncLoop( i, ua, callback ) {

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

                    data.push({ 

                      modul: ua[i].modul,
                      user: user.name,
                      avatar: avatar,
                      timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                      action: ua[i].action

                    });

                     asyncLoop( i+1, ua, callback );

                });

              }else{


                data.push({ 

                  modul: ua[i].modul,
                  user: user.name,
                  avatar: 'default_avatar.jpg',
                  timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                  action: ua[i].action

                });

                asyncLoop( i+1, ua, callback );

              }

          });
      
        } else {

          callback();
      
        }
  } 
};
// Creates a new province in the DB.
exports.create = function(req, res) {
  

};

// Updates an existing province in the DB.
exports.update = function(req, res) {
  

};

// Deletes a province from the DB.
exports.destroy = function(req, res) {
  

};

function handleError(res, err) {
  return res.status(500).send(err);
}
