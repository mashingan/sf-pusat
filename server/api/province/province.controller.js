'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var Province = require('./province.model');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;



exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable
};
// Get list of provinces
exports.index = function(req, res) {

  var limit = req.params.limit || 10;
  var page = req.params.page || 1;
  var order = req.params.order || 'name';
  var offset = (page-1) * limit;

  if(req.params.filter){

    var re = new RegExp(req.params.filter, 'i');
    var filter = [{ 'name': { $regex: re }}];

  }else{

    var filter = '-';

  }

  if(req.params.filter!='-'){

    Province.find({}, function (err, provinces) {


      
      if(err){

          return res.status(200).json({ result : "failed", message : err});
      
      }

      if(provinces){

        return res.status(200).json({ result : "success", count : provinces.length, message : 'success pull data!', data : provinces});

      }else{

        return res.status(200).json({result : "failed", message : "Data is empty."});

      }

    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Province.find({}, function (err, provinces) {

      if(err){

          return res.status(200).json({ result : "failed", message : err});
      
      }

      if(provinces){

        return res.status(200).json({ result : "success", count : provinces.length, message : 'success pull data!', data : provinces});

      }else{

        return res.status(200).json({ result : "failed", message : "Data is empty."});

      }

    })
    .sort(order)
    .skip(offset)
    .limit(limit);
    
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
  Province.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    Province.find({},function (err, provinces) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_province': provinces}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Province.find({}, function (err, provinces) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_province': provinces}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }


};
// Get a single province
exports.show = function(req, res) {
  Province.findById(req.params.id, function (err, province) {
    if(err) { return handleError(res, err); }
    if(!province) { return res.status(404).send('Not Found'); }
    return res.json(province);
  });
};

// Creates a new province in the DB.
exports.create = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  Province.create(req.body, function(err, province) {
    if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Province', action: 'Create', user: req.body.user_op },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Province' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:province", ua_modul);
              
            });

        }).sort({ createdAt : -1 })
          .limit(5);  

      });

    return res.status(201).json(province);
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

// Updates an existing province in the DB.
exports.update = function(req, res) {
  var name = String(req.body.name);
  var id = req.body.id;
  var ua_dashboard = [];
  var ua_modul = [];
  Province.findById(id, function (err, province) {

      province.name = name;
  
      province.save(function(err) {
        if (err) return validationError(res, err);
          UserActivity.create({ modul : 'Province', action: 'Update', user: req.body.user_op },function(err, log){

              /* find log activity then update data on dashboard */
              UserActivity.find({}, function (err, ua) {
                 
                  asyncLoop( 0, ua,'dashboard', function(){

                      /* send info to socket */
                      Socket.emit("activity:user", ua_dashboard); 

                    
                  });

              }).sort({ createdAt : -1 })
                .limit(5);

              /* find log activity then update data on modul activity */
              UserActivity.find({modul: 'Province' }, function (err, ua) {
                 
                  asyncLoop( 0, ua,'modul', function(){

                    /* send info to socket */
                    Socket.emit("activity:modul:province", ua_modul);
                    
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

// Deletes a province from the DB.
exports.destroy = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  Province.findById(req.params.id, function (err, province) {
    if(err) { return handleError(res, err); }
    if(!province) { return res.status(404).send('Not Found'); }
    province.remove(function(err) {
      if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Province', action: 'Delete', user: req.params.user },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Province' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:province", ua_modul);
              
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
  var provinces = req.body;
  var ua_dashboard = [];
  var ua_modul = [];

  for (var index in provinces) {

      Province.findByIdAndRemove(provinces[index]._id, function(err, province) {

      });
  }
  UserActivity.create({ modul : 'Province', action: 'Delete Multiple Row', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua,'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'Province' }, function (err, ua) {
         
          asyncLoop( 0, ua,'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:province", ua_modul);
            
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
