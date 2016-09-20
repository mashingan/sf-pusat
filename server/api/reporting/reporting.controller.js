var EventEmitter = require('events').EventEmitter;
var UserLogging = require('../userLogging/userLogging.model');
var User = require('../user/user.model');
var TypeOfBreaktime = require('../type_of_breaktime/typeofbreaktime.model');
var TaggingTransaction = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');

var PerformanceData = require('./performanceData');
var reportUtil = require('./reporting.util');
var reportData = require('./reporting.data');

module.exports.performance = function (req, res) {
  var emitter = new EventEmitter();
  var limit = req.params.limit;
  var page = req.params.page;
  var gallery = req.params.where;
  var date = reportUtil.getDate(req.params.when);
  
  let mindata = (page - 1) * limit;
  let maxdata = mindata + limit;

  var staffs = [];
  var nameNik = [];

  var result = reportData.performanceData;
  TypeOfBreaktime.find({}, function (err, tos) {
    if (err) console.log('%s: Cannot fetch breaktime: %s',
        __filename, err.message);
    result.breaktimes = tos;
  });
  result.data = [];
  emitter.on('done', function () {
    res.status(200).json(result);
  });


  emitter.on('populate-data', function () {
    gallery = gallery === '-' ? '' : gallery;
    for (let i = 0, elemCount = 0;
        i < nameNik.length || elemCount < maxdata;
        i++) {
      let when = req.params.when;
      let user = nameNik[i];
      let dt;
      if (when && typeof when.split === 'function' &&
          (dt = when.split(':')).length === 2) {
        let from = new Date(dt[0]).getTime();
        let to = new Date(dt[1]).getTime();
        while (to >= from) {
          if (elemCount >= mindata && elemCount < maxdata)
            result.data.push(new PerformanceData(user.name, user.nik,
                  reportUtil.getDate(to)), gallery);
          to -= reportUtil.ONEDAY;
          elemCount++;
        }
      } else {
        if (elemCount >= mindata && elemCount < maxdata)
          result.data.push(new PerformanceData(user.name, user.nik,
                date, gallery));
        elemCount++;
      }

      if (elemCount >= maxdata)
        emitter.emit('done');

      if (i === nameNik.length - 1)
        emitter.emit('done');
    }
  });

  if (gallery !== '-') {
    User.find({ gallery: gallery }, function (errusers, users) {
      if (errusers) {
        console.log('cannot fetch users from gallery %s', gallery);
        return res.status(404).json({
          result: 'failed',
          message: errusers.message
        });
      }
      users.forEach(function (user) {
        staffs.push(user.name);
        nameNik.push({
          name: user.name,
          nik: user.nik
        });
      });
      emitter.emit('populate-data');
    });
  } else {
    UserLogging.distinct('name', function (errusers, users) {
      if (errusers) {
        console.log('cannot fetch users name from userLogging: ',
          errusers.message);
        return res.status(404).json({
          result: 'failed',
          message: errusers.message
        });
      }

      staffs = users;
      staffs.forEach(function (name) {
        User.findOne({ name: name }, function (err, user) {
          if (err) return console.log('In %s: cannot find user: %s',
              __filename, err.message);
          nameNik.push({
            name: name,
            nik: user.nik
          });
        });
      });
      emitter.emit('populate-data');
    });
  }
}

module.exports.transaction = function (req, res) {
  toBeImplemented(res);
};

module.exports.customer = function (req, res) {
  toBeImplemented(res);
};

module.exports.productivity = function (req, res) {
  toBeImplemented(res);
};

function toBeImplemented (res) {
  res.status(404).json({
    result: 'failed',
    message: 'To be implemented'
  });
}
