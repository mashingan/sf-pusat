'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var TaggingTransaction = require('./tagging_transaction.model');
var moment = require('moment');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;



exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable
};
// Get list of taggingtransactions
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

    TaggingTransaction.find({}, function (err, taggingtransactions) {



      if(err){

          return res.status(200).json({ result : "failed", message : err});

      }

      if(taggingtransactions){

        return res.status(200).json({ result : "success", count : taggingtransactions.length, message : 'success pull data!', data : taggingtransactions});

      }else{

        return res.status(200).json({result : "failed", message : "Data is empty."});

      }

    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    TaggingTransaction.find({}, function (err, taggingtransactions) {

      if(err){

          return res.status(200).json({ result : "failed", message : err});

      }

      if(taggingtransactions){

        return res.status(200).json({ result : "success", count : taggingtransactions.length, message : 'success pull data!', data : taggingtransactions});

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
  TaggingTransaction.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    TaggingTransaction.find({},function (err, taggingtransactions) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_taggingtransaction': taggingtransactions}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    TaggingTransaction.find({}, function (err, taggingtransactions) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_taggingtransaction': taggingtransactions}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }


};
// Get a single taggingtransaction
exports.show = function(req, res) {
  
  var tagging_code = req.body.tagging_code;

  TaggingTransaction.findOne({ tagging_code : tagging_code }, function (err, taggingtransaction) {
    
    if(err) { return handleError(res, err); }

    if(!taggingtransaction) { 

      return res.status(200).json({ result: "failed", message: "Invalid Tagging Code!" }); 

    }

    return res.status(200).json({
      result: "success",
      message: "success pull data!",
      id: taggingtransaction._id,
      tagging_code: taggingtransaction.tagging_code,
      level_1: taggingtransaction.level_1,
      level_2: taggingtransaction.level_2,
      level_3: taggingtransaction.level_3,
      level_4: taggingtransaction.level_4,
      sla : taggingtransaction.sla
    });

  });

};

exports.detail = function(req, res) {
  TaggingTransaction.findById(req.params.id, function (err, taggingtransaction) {
    if(err) { return handleError(res, err); }
    if(!taggingtransaction) { return res.status(404).send('Not Found'); }
    return res.json(taggingtransaction);
  });
};

exports.create = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  TaggingTransaction.create(req.body, function(err, taggingtransaction) {
    if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Tagging Transaction', action: 'Create', user: req.body.user_op },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Tagging Transaction' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:tagging_transaction", ua_modul);
              
            });

        }).sort({ createdAt : -1 })
          .limit(5);  

      });
    return res.status(201).json(taggingtransaction);
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


exports.update = function(req, res) {
  var tagging_code = String(req.body.tagging_code);
  var level_1 = String(req.body.level_1);
  var level_2 = String(req.body.level_2);
  var level_3 = String(req.body.level_3);
  var level_4 = String(req.body.level_4);
  var id = req.body.id;
  var ua_dashboard = [];
  var ua_modul = [];
  
  TaggingTransaction.findById(id, function (err, taggingtransaction) {

      taggingtransaction.tagging_code = tagging_code;
      taggingtransaction.level_1 = level_1;
      taggingtransaction.level_2 = level_2;
      taggingtransaction.level_3 = level_3;
      taggingtransaction.level_4 = level_4;

      taggingtransaction.save(function(err) {
        if (err) return validationError(res, err);
          UserActivity.create({ modul : 'Tagging Transaction', action: 'Update', user: req.body.user_op },function(err, log){

              /* find log activity then update data on dashboard */
              UserActivity.find({}, function (err, ua) {
                 
                  asyncLoop( 0, ua,'dashboard', function(){

                      /* send info to socket */
                      Socket.emit("activity:user", ua_dashboard); 

                    
                  });

              }).sort({ createdAt : -1 })
                .limit(5);

              /* find log activity then update data on modul activity */
              UserActivity.find({modul: 'Tagging Transaction' }, function (err, ua) {
                 
                  asyncLoop( 0, ua,'modul', function(){

                    /* send info to socket */
                    Socket.emit("activity:modul:tagging_transaction", ua_modul);
                    
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


exports.destroy = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  TaggingTransaction.findById(req.params.id, function (err, taggingtransaction) {
    if(err) { return handleError(res, err); }
    if(!taggingtransaction) { return res.status(404).send('Not Found'); }
    taggingtransaction.remove(function(err) {
      if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Tagging Transaction', action: 'Delete', user: req.params.user },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Tagging Transaction' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:tagging_transaction", ua_modul);
              
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
  var taggingtransactions = req.body;
  var ua_dashboard = [];
  var ua_modul = [];

  for (var index in taggingtransactions) {

      TaggingTransaction.findByIdAndRemove(taggingtransactions[index]._id, function(err, taggingtransaction) {

      });
  }
  UserActivity.create({ modul : 'Tagging Transaction', action: 'Delete Multiple Row', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua,'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'Tagging Transaction' }, function (err, ua) {
         
          asyncLoop( 0, ua,'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:tagging_transaction", ua_modul);
            
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
