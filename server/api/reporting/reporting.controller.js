var EventEmitter = require('events').EventEmitter;
var UserLogging = require('../userLogging/userLogging.model');
var User = require('../user/user.model');
var TypeOfBreaktime = require('../type_of_breaktime/typeofbreaktime.model');
var TaggingTransaction = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');
var Productivity = require('../productivity/productivity.model');

var createPerformanceData = require('./performanceData');
var transactionsInfo = require('./transactionData.js');
var customersInfo = require('./customerData.js');
var reportUtil = require('./reporting.util');
var reportData = require('./reporting.data');

module.exports.performance = function (req, res) {
  var emitter = new EventEmitter();
  var limit = req.params.limit;
  var page = req.params.page;
  var gallery = req.params.where;
  var date = reportUtil.getDate(req.params.when);
  
  var [mindata, maxdata] = reportUtil.getMinimax(limit, page);

  var staffs = [];
  var nameNik = [];

  var result = reportData.performanceData;
  TypeOfBreaktime.find({}, function (err, tos) {
    if (err) console.log('%s: Cannot fetch breaktime: %s',
        __filename, err.message);
    result.breaktimes = tos;
  });
  result.data = [];
  emitter.once('done', function () {
    res.status(200).json(result);
  });

  emitter.once('populate-data', function () {
    gallery = gallery === '-' ? '' : gallery;
    for (var i = 0, elemCount = 0;
        i < nameNik.length || elemCount < maxdata;
        i++) {
      var when = req.params.when;
      var user = nameNik[i];
      if (when && typeof when.split === 'function' &&
          when.split(':').length === 2) {
        var [from, to] = reportUtil.getFromTo(when);
        while (to >= from) {
          if (elemCount >= mindata && elemCount < maxdata)
            /*
            result.data.push(createPerformanceData(user.name, user.nik,
                  reportUtil.getDate(to)), gallery);
          */
            createPerformanceData(user.name, user.nik,
                reportUtil.getDate(to), gallery).then(
                gettingPromiseFromPerformance(), unfulfilledPromise());
          to -= reportUtil.ONEDAY;
          elemCount++;
        }
      } else {
        if (elemCount >= mindata && elemCount < maxdata)
          /*
          result.data.push(createPerformanceData(user.name, user.nik,
                date, gallery));
          */
          createPerformanceData(user.name, user.nik, date, gallery)
            .then(gettingPromiseFromPerformance(), unfulfilledPromise());
        elemCount++;
      }

      if (elemCount >= maxdata)
        emitter.emit('done');

      if (i === nameNik.length - 1)
        emitter.emit('done');
    }
  });

  function gettingPromiseFromPerformance () {
    return function (success) {
      result.data.push(success);
    };
  }

  function unfulfilledPromise() {
    return function (reject) {};
  }

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
  var limit = req.params.limit;
  var page = req.params.page;
  var where = req.params.where;
  var who = req.params.who;
  var when = req.params.when;

  var [mindata, maxdata] = reportUtil.getMinimax(limit, page);
  transactionsInfo(res, when, where, who, mindata, maxdata);
  
};

module.exports.customer = function (req, res) {
  var limit = req.params.limit;
  var page = req.params.page;
  var where = req.params.where;
  var when = req.params.when;

  var [mindata, maxdata] = reportUtil.getMinimax(limit, page);
  customersInfo(res, when, where, mindata, maxdata);
};

module.exports.productivity = function (req, res) {
  var limit = req.params.limit;
  var page = req.params.page;
  var where = req.params.where;
  var when = req.params.when;
  var date = reportUtil.getDate(when);

  var [mindata, maxdata] = reportUtil.getMinimax(limit, page, 30);
  var [placeInfo, placeName] = reportUtil.splitPlace(where);

  var result = reportData.productivityData;
  var productivity = Productivity.find({ date: date});

  if (placeInfo && placeName) {
    var filter = {};
    filter[placeInfo] = placeName;
    productivity = productivity.or(filter);
  }

  productivity
    .sort('-date')
    .skip(mindata)
    .limit(limit)
    .exec(function (err, productivities) {
      if (err) {
        console.log('%s: Error fetching productivity: %s',
          __filename, err.message);
        return res.status(404).json({
          result: 'failed',
          message: err.message
        });
      }
      result.data = productivities;
      res.status(200).json({result});
    });
};
