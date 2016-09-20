'use strict';

var UserLogging = require('./userLogging.model');

function logger (user, type) {
  var date = new Date();
  return {
    date: date,
    nik: user.nik,
    name: user.name,
    activity: type,
    time: date
  }
}

function consoleLogger(user, type) {
  return function (err, doc) {
    if (err) {
      console.log('%s %s cannot be logged: %s',
          user.name, type, err.message);
      return;
    }
    console.log('%s is %s : %s',
        user.name, type, new Date().toISOString());
  };
}

module.exports.loginLog = function (user) {
  if (!user.online_status)
    UserLogging.create(logger(user, 'login'), consoleLogger(user, 'login'));
};

module.exports.logoutLog = function (user) {
  UserLogging.create(logger(user, 'logout'), consoleLogger(user, 'logout'));
};
