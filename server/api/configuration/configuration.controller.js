'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var Config = require('./configuration.model');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Socket = null;



exports.socketHandler = function (socket, socketio) {

    Socket = socketio;
};


exports.smtp_config = function(req, res) {

  Config.find({scope: "SMTP"},function(err, config){

    res.status(200).json({ result: "success", data: config });

  });
  
};
exports.smtp_config_update = function(req, res) {

  var smtp_user = req.body.smtp_user;
  var smtp_password = req.body.smtp_password;
  var ua_dashboard = [];
  var ua_modul = [];
  Config.findOne({scope: "SMTP", key: "smtp_user"}, function(err, config_user){

    config_user.value = smtp_user;

    config_user.save(function(){

       Config.findOne({scope: "SMTP", key: "smtp_password"}, function(err, config_password){

          config_password.value = smtp_password;
          
          config_password.save(function(){

             UserActivity.create({ modul : 'SMTP EMAIL', action: 'Update', user: req.body.user_op },function(err, log){

                /* find log activity then update data on dashboard */
                UserActivity.find({}, function (err, ua) {
                   
                    asyncLoop( 0, ua,'dashboard', function(){

                        /* send info to socket */
                        Socket.emit("activity:user", ua_dashboard); 

                      
                    });

                }).sort({ createdAt : -1 })
                  .limit(5);

                /* find log activity then update data on modul activity */
                UserActivity.find({modul: 'SMTP EMAIL' }, function (err, ua) {
                   
                    asyncLoop( 0, ua,'modul', function(){

                      /* send info to socket */
                      Socket.emit("activity:modul:smtp_email", ua_modul);
                      
                    });

                }).sort({ createdAt : -1 })
                  .limit(5);  

            });

            res.status(200).send('OK');


          });

       }) 

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
exports.email_activation_template = function(req, res) {

  Config.find({scope: "EMAIL_ACTIVATION_TEMPLATE"},function(err, config){

    res.status(200).json({ result: "success", data: config });

  });
  
};
exports.email_activation_template_update = function(req, res) {

  var email_template = req.body.email_template;
  var email_subject = req.body.email_subject;
  var email_from = req.body.email_from;
  var ua_dashboard = [];
  var ua_modul = [];

  Config.findOne({scope: "EMAIL_ACTIVATION_TEMPLATE", key: "template"}, function(err, config_template){

    config_template.value = email_template;

    config_template.save(function(){

       Config.findOne({scope: "EMAIL_ACTIVATION_TEMPLATE", key: "subject"}, function(err, config_subject){

          config_subject.value = email_subject;
          
          config_subject.save(function(){

             Config.findOne({scope: "EMAIL_ACTIVATION_TEMPLATE", key: "from"}, function(err, config_from){

                config_from.value = email_from;

                config_from.save(function(){

                  UserActivity.create({ modul : 'EMAIL ACTIVATION TEMPLATE', action: 'Update', user: req.body.user_op },function(err, log){

                      /* find log activity then update data on dashboard */
                      UserActivity.find({}, function (err, ua) {
                         
                          asyncLoop( 0, ua,'dashboard', function(){

                              /* send info to socket */
                              Socket.emit("activity:user", ua_dashboard); 

                            
                          });

                      }).sort({ createdAt : -1 })
                        .limit(5);

                      /* find log activity then update data on modul activity */
                      UserActivity.find({modul: 'EMAIL ACTIVATION TEMPLATE' }, function (err, ua) {
                         
                          asyncLoop( 0, ua,'modul', function(){

                            /* send info to socket */
                            Socket.emit("activity:modul:email_activation_template", ua_modul);
                            
                          });

                      }).sort({ createdAt : -1 })
                        .limit(5);  

                  });

                  res.status(200).send('OK');

                });  

             }); 
            

          });

       }) 

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
exports.email_template = function(req, res) {

  Config.find({scope: "EMAIL_TEMPLATE"},function(err, config){

    res.status(200).json({ result: "success", data: config });

  });
  
};

exports.email_template_update = function(req, res) {

  var email_template = req.body.email_template;
  var email_subject = req.body.email_subject;
  var email_from = req.body.email_from;
  var ua_dashboard = [];
  var ua_modul = [];
  Config.findOne({scope: "EMAIL_TEMPLATE", key: "template"}, function(err, config_template){

    config_template.value = email_template;

    config_template.save(function(){

       Config.findOne({scope: "EMAIL_TEMPLATE", key: "subject"}, function(err, config_subject){

          config_subject.value = email_subject;
          
          config_subject.save(function(){

             Config.findOne({scope: "EMAIL_TEMPLATE", key: "from"}, function(err, config_from){

                config_from.value = email_from;

                config_from.save(function(){

                  UserActivity.create({ modul : 'EMAIL TEMPLATE', action: 'Update', user: req.body.user_op },function(err, log){

                      /* find log activity then update data on dashboard */
                      UserActivity.find({}, function (err, ua) {
                         
                          asyncLoop( 0, ua,'dashboard', function(){

                              /* send info to socket */
                              Socket.emit("activity:user", ua_dashboard); 

                            
                          });

                      }).sort({ createdAt : -1 })
                        .limit(5);

                      /* find log activity then update data on modul activity */
                      UserActivity.find({modul: 'EMAIL TEMPLATE' }, function (err, ua) {
                         
                          asyncLoop( 0, ua,'modul', function(){

                            /* send info to socket */
                            Socket.emit("activity:modul:email_template", ua_modul);
                            
                          });

                      }).sort({ createdAt : -1 })
                        .limit(5);  

                  });

                  res.status(200).send('OK');

                });  

             }); 
            

          });

       }) 

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
exports.zsmart_api_config = function(req, res) {

  Config.find({scope: "ZSMART_API"},function(err, config){

    res.status(200).json({ result: "success", data: config });

  });
 
};

exports.zsmart_api_config_update = function(req, res) {

  var api_url = req.body.api_url;
  var user = req.body.user;
  var password = req.body.password;
  var action_id = req.body.action_id;
  var ua_dashboard = [];
  var ua_modul = [];
  
  Config.findOne({scope: "ZSMART_API", key: "API_URL"}, function(err, config_url){

    config_url.value = api_url;

    config_url.save(function(){

      Config.findOne({scope: "ZSMART_API", key: "user"}, function(err, config_user){

        config_user.value = user;

        config_user.save(function(){

          Config.findOne({scope: "ZSMART_API", key: "password"}, function(err, config_pass){

            config_pass.value = password;

            config_pass.save(function(){

              Config.findOne({scope: "ZSMART_API", key: "action_id"}, function(err, config_action){

                config_action.value = action_id;

                config_action.save(function(){

                  UserActivity.create({ modul : 'ZSMART API', action: 'Update', user: req.body.user_op },function(err, log){

                    /* find log activity then update data on dashboard */
                    UserActivity.find({}, function (err, ua) {
                       
                        asyncLoop( 0, ua,'dashboard', function(){

                            /* send info to socket */
                            Socket.emit("activity:user", ua_dashboard); 

                          
                        });

                    }).sort({ createdAt : -1 })
                      .limit(5);

                    /* find log activity then update data on modul activity */
                    UserActivity.find({modul: 'ZSMART API' }, function (err, ua) {
                       
                        asyncLoop( 0, ua,'modul', function(){

                          /* send info to socket */
                          Socket.emit("activity:modul:zsmart_api", ua_modul);
                          
                        });

                    }).sort({ createdAt : -1 })
                      .limit(5);  

                  });
                  res.status(200).send('OK');
                });
              });
            });
          });
        });          
      });
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
exports.gallery_config = function(req, res) {
 
  Config.find({scope: "GALLERY"},function(err, config){

    res.status(200).json({ result: "success", data: config });

  });

};
exports.gallery_config_update = function(req, res) {
 
  var distance = req.body.distance;
  var ua_dashboard = [];
  var ua_modul = [];
  Config.findOne({scope: "GALLERY", key: "distance"}, function(err, config_distance){

    config_distance.value = distance;

    config_distance.save(function(){

      UserActivity.create({ modul : 'GALLERY CONFIG', action: 'Update', user: req.body.user_op },function(err, log){

          /* find log activity then update data on dashboard */
          UserActivity.find({}, function (err, ua) {
             
              asyncLoop( 0, ua,'dashboard', function(){

                  /* send info to socket */
                  Socket.emit("activity:user", ua_dashboard); 

                
              });

          }).sort({ createdAt : -1 })
            .limit(5);

          /* find log activity then update data on modul activity */
          UserActivity.find({modul: 'GALLERY CONFIG' }, function (err, ua) {
             
              asyncLoop( 0, ua,'modul', function(){

                /* send info to socket */
                Socket.emit("activity:modul:gallery_config", ua_modul);
                
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

exports.system_config = function(req, res) {

  
};
exports.system_config_update = function(req, res) {

  
};

exports.getVersion = function (req, res) {
    return res.status(200).json({ version: '0.8.357' });
};

exports.putVersion = function (req, res) {
    var version = req.body.version;
    Config.findOneAndUpdate({ scope: 'version' },
        { value: version }, function (err, success) {
        if (err) return res.status(500).json({
            status: 'failed',
            message: err.message
        });
        return res.status(200).json({
            status: 'success',
            message: 'version updated to ' + version
        });
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
