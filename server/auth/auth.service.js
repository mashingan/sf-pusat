'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });
var useragent = require('useragent');
var Socket = null;



exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable

};
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      var data = [];

      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');
        if(user){

            var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
            var agent = useragent.parse(req.headers['user-agent']);

            user.last_ip_login = ip;
            user.online_status = true;
            user.last_user_agent_login = agent.toAgent();
            user.save(function(){

              User.find({online_status:true},function(err, users){

                asyncLoop( 0, users, function(){

                  if(Socket!=null){

                    Socket.emit('user:online',data);
                  
                  }
                 
                });
                
              });
              
              req.user = user;
              next();
            });
        }
        
      });
      function asyncLoop( i, users, callback ) {

          var num_rows = users.length;
          var avatar = "";
          if( i < num_rows ) {
              
              if(users[i].picture!=""){
                avatar = users[i].picture;
                fs.stat(path.join(__dirname,"../../client/media/user/"+users[i].picture), function(err, stat) {
                    
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
    });
    
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: '10h' });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;