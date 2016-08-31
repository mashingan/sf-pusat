'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var User = require('../user/user.model');
var Role = require('../role/role.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;



exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable
};

var validationError = function(res, err) {
  return res.status(422).json(err);
};

exports.localSync = function (req, res) {
  var _response = { sync: [], new: []};
  var _idarr = Array.isArray(user)?
    req.body.user.map(function(d) {
      return d.nik;
    }) : [req.body.user.nik];

  if (_idarr.length > 0) {

    User.remove({ nik: { $in: _idarr}}, function (err) {
      if (err) return res.status(500).send(err);
      User.create(req.body.user.map(function (d) {
          d.sync = true;
          return d;
        }), function (err, user) {
          if (err) return res.status(500).send(err);
          var _sync = Array.isArray(user) ? user : [user];
          _response.sync = _sync.map(function (d) { return d.nik; });
          _update();
      });
    });
  }
  else {
    _update();
  }

  function _update() {
    User.find({
      'role_item.0.value': req.body.gallery.name,
      sync: false,
      nik: { $nin: _idarr }},
      function (err, user) {
        if (user) {
          User.update({ nik: user.map(function (d) {
                  return d.nik; })},
            { $set: { sync: true }},
            { multi: true },
            function (err) {
              if (err) return res.status(500).send(err);
              _response.new = user;
              return res.status(200).json(_response);
          });
        } else {
          return res.status(200).json(_response);
        }
    });
  }
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  }).limit(10);

};

exports.delete_cover = function(req,res){

  var id = req.params.id;

  User.findById(id,function(err, user){


    if(user.picture){

        var remove_item = user.picture;

        user.picture = null;

        user.save(function(err, items){

          /* unlink old picture */
          require("fs").unlink("client/media/user/" + remove_item, function(err) {

              res.status(200).json({result : "success", message : "Delete successfully!" ,remove_item : remove_item});

          });

        });



    }

  });

}
exports.logout = function(req, res){

  var id = req.params.id;
  var data = [];

  User.findById(id, function(err, user){

    if(user){

      user.online_status = false;

      user.save(function(){

        User.find({online_status:true}, '-salt -hashedPassword', function (err, users) {
      
          asyncLoop( 0, users, function(){

            Socket.emit('user:online', data);
           
          });

        });

      });

    }

  });
  function asyncLoop( i, users, callback ) {

      var num_rows = users.length;
      var avatar = "";
      if( i < num_rows ) {
          
          if(users[i].picture!=""){
            avatar = users[i].picture;
            fs.stat(path.join(__dirname,"../../../client/media/user/"+users[i].picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                data.push({
                  name: users[i].name,
                  picture: avatar,
                  last_ip_login: users[i].last_ip_login,
                  last_user_agent_login: users[i].last_user_agent_login
                });

                 asyncLoop( i+1, users, callback );

            });
          }else{


            data.push({
              name: users[i].name,
              picture: 'default_avatar.jpg',
              last_ip_login: users[i].last_ip_login,
              last_user_agent_login: users[i].last_user_agent_login
            });

            asyncLoop( i+1, users, callback );

          }

      } else {

        callback();
    
      }
  } 
  

};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.list = function(req, res) {

  var limit = req.params.limit;
  var page = req.params.page;
  var order = req.params.order;
  var offset = (page-1) * limit;
  var re = new RegExp(req.params.filter, 'i');
  var filter = [
    { 'name': { $regex: re }},
    { 'email': { $regex: re }}
  ];

  var c;
  User.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    User.find({}, '-salt -hashedPassword', function (err, users) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_user': users}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    User.find({}, '-salt -hashedPassword', function (err, users) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_user': users}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }


};

exports.online_user = function (req, res){
  var data = [];
  User.find({ online_status : true }, '-salt -hashedPassword', function(err, users) {

    asyncLoop( 0, users, function(){

      res.status(200).json(data);
     
    });
  
  });
  function asyncLoop( i, users, callback ) {

      var num_rows = users.length;
      var avatar = "";
      if( i < num_rows ) {
          
          if(users[i].picture!=""){
            avatar = users[i].picture;
            fs.stat(path.join(__dirname,"../../../client/media/user/"+users[i].picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                data.push({
                  name: users[i].name,
                  picture: avatar,
                  last_ip_login: users[i].last_ip_login,
                  last_user_agent_login: users[i].last_user_agent_login
                });

                 asyncLoop( i+1, users, callback );

            });
          }else{


            data.push({
              name: users[i].name,
              picture: 'default_avatar.jpg',
              last_ip_login: users[i].last_ip_login,
              last_user_agent_login: users[i].last_user_agent_login
            });

            asyncLoop( i+1, users, callback );

          }

      } else {

        callback();
    
      }
  } 
};
/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var ua_dashboard = [];
  var ua_modul = [];
  var form = new formidable.IncomingForm();

  form.uploadDir = path.join(__dirname,"../../../client/media/user");

  form.parse(req, function(err, fields, files) {

    req.body.nik = fields.nik;
    req.body.name = fields.name;
    req.body.email = fields.email;
    req.body.role = fields.role;
    req.body.password = fields.password;
    
    if(files['files[]']){
      req.body.picture = files['files[]'].name;
    }else{
      req.body.picture = '';
    }
    
    var newUser = new User(req.body);
    newUser.provider = 'local';

    if(req.body.role == "CSR"){
      newUser.role_item = [{ name: "Gallery", value: fields.role_item_1},{ name: "Counter", value: fields.role_item_2}];    
    }
    newUser.save(function(err, user) {
      if (err) return validationError(res, err);
      var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
      UserActivity.create({ modul : 'User', action: 'Create', user: fields.user_op },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'User' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:user", ua_modul);
              
            });

        }).sort({ createdAt : -1 })
          .limit(5);  

      });
      res.json({ token: token });
    });

  });
  form.on ('fileBegin', function(name, file){
      file.path = form.uploadDir + "/" + file.name;
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

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    if(user){

      res.json(user.profile);

    }
    
  });
};

exports.online_csr = function (req, res, next) {
  
  var gallery = req.body.gallery;
  var counter = req.body.counter;
  var counters = [];

  User.find({role : "CSR", online_status: true, 'role_item.0.value' : gallery, 'role_item.1.value' : {'$ne': counter } } ,function(err, csr){
      if(csr){

        for(var i=0; i < csr.length; i++){

          counters.push(csr[i].role_item[1].value);

        }

        return res.status(200).json({ result:"success", message:"successfully get data!", counters: counters });

      }
  });

};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    UserActivity.create({ modul : 'User', action: 'Delete', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua, 'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'User' }, function (err, ua) {
         
          asyncLoop( 0, ua, 'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:user", ua_modul);
            
          });

      }).sort({ createdAt : -1 })
        .limit(5);  

    });
    return res.status(204).send('No Content');
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

/**
 * Deletes all selected user
 * restriction: 'admin'
 */
exports.destroy_all = function(req, res) {
  var users = req.body;
  var ua_dashboard = [];
  var ua_modul = [];
  for (var index in users) {
      console.log( users[index] );
      User.findByIdAndRemove(users[index]._id, function(err, user) {

      });
  }
  UserActivity.create({ modul : 'User', action: 'Delete Multiple Row', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua,'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'User' }, function (err, ua) {
         
          asyncLoop( 0, ua,'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:user", ua_modul);
            
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

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};
exports.update = function(req, res, next) {
  var ua_dashboard = [];
  var ua_modul = [];
  var form = new formidable.IncomingForm();

  form.uploadDir = path.join(__dirname,"../../../client/media/user");

  form.parse(req, function(err, fields, files) {

    User.findById(fields.id, function (err, user) {

      if(fields.role == "CSR"){
        user.role_item = [{ name: "Gallery", value: fields.role_item_1},{ name: "Counter", value: fields.role_item_2}];    
      }
      user.nik = fields.nik;
      user.name = fields.name;
      user.email = fields.email;
      user.role = fields.role;
      user.sync = false;

      if(files['files[]']){
        user.picture = files['files[]'].name;
      }

      if(fields.password!=""){
        user.password = fields.password;
      }

      user.save(function(err) {
        if (err) return validationError(res, err);
        UserActivity.create({ modul : 'User', action: 'Update', user: fields.user_op },function(err, log){

              /* find log activity then update data on dashboard */
              UserActivity.find({}, function (err, ua) {
                 
                  asyncLoop( 0, ua,'dashboard', function(){

                      /* send info to socket */
                      Socket.emit("activity:user", ua_dashboard); 

                    
                  });

              }).sort({ createdAt : -1 })
                .limit(5);

              /* find log activity then update data on modul activity */
              UserActivity.find({modul: 'User' }, function (err, ua) {
                 
                  asyncLoop( 0, ua,'modul', function(){

                    /* send info to socket */
                    Socket.emit("activity:modul:user", ua_modul);
                    
                  });

              }).sort({ createdAt : -1 })
                .limit(5);  

          });
        res.status(200).send('OK');
      });

    });

  });
  form.on ('fileBegin', function(name, file){
      file.path = form.uploadDir + "/" + file.name;
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
/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    if(user){
      Role.findOne({ name: user.role},function(err,role){
        if(role){
          user.menu_privilege = role.menu_privilege;
        }else{
          user.menu_privilege = [
            {
              id: 'toogle_1',
              name: 'Queueing System',
              type: 'heading',
              children: [
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    state: 'admin',
                    type: 'link',
                    icon: 'fa fa-bar-chart'

                }
                  
              ]
            }
          ];
        }
        
        if(user.picture!=""){
          fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
              
              if(err){
                user.picture = 'default_avatar.jpg';
              }
              res.json(user);

          });
        }else{

          user.picture = 'default_avatar.jpg';
          res.json(user);

        }

      });
    }
   
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
