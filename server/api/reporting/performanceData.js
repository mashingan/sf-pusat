var UserLogging = require('../userLogging/userLogging.model');
var User = require('../user/user.model');
var TicketTagging = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');
var reportUtil = require('./reporting.util');

function PerformanceData (name, nik, date, gallery) {
  var self = this;

  self.date = date.$gte;

  // Staff info
  self.name = name;
  self.nik = nik;
  self.gallery = gallery || '';

  // Staff login and logout time
  self.login = '0';
  self.logout = '0';

  // Staff logout breakdown details
  self.totalLogout = 0;
  self.totalLogoutTime = '00:00:00';
  self.averageLogoutTime = '00:00:00';

  // Staff breaktime duration and its breakdown
  self.totalBreaktime = '';
  self.breaktimes = [];

  // Staff transaction info
  self.totalTransaction = 0;
  self.totalServed = 0;
  self.noShow = 0;
  self.totalTransactionTime = '';
  self.averageHandlingTime = '';

  if (self.gallery === '') {
    User.findOne({ name: name, nik: nik }, function (err, user) {
      if (err) {
        console.log('err finding user:', err.message);
        return;
      }
      self.gallery = user.gallery;
    });
  }

  var opt = {
    name: self.name
  };
  if (date) opt.date = date;
  UserLogging
    .find(opt)
    .sort('time')
    .exec(function (err, docs) {
      if (err) {
        console.log('Cannot retrieve user logs:', err.message);
        return;
      }

      var logins = docs.filter(function (doc) {
        return doc.activity === 'login';
      });

      var logouts = docs.filter(function (doc) {
        return doc.activity === 'logout';
      });
      
      var breaktimes = docs.filter(function (doc) {
        return doc.activity !== 'login' && doc.activity !== 'logout';
      });
      
      if (Array.isArray(logins) && logins.length >= 1)
        self.login = reportUtil.getTimeString(logins[0].time);

      if (Array.isArray(logouts) && logouts.length >= 1) {
        self.logout = reportUtil.getTimeString(
            logouts[logouts.length - 1].time);  // get last logout
        self.totalLogout = logouts.length;
        self.totalLogoutTime = '0';
        for (var idxout = 0, idxin = 1;
            idxout < logouts.length || idxin < logins.length;
            idxout++, idxin++) {
          var startTiming = logouts[idxout].time;
          var endTiming = logins[idxin].time;
          var diffTime = new Date(endTiming.getTime () -
              startTiming.getTime());
          var diffDuration = reportUtil.splitTime(
              diffTime, 'toUTCString', 4);
          self.totalLogoutTime = reportUtil.opDurations([
              self.totalLogoutTime, diffDuration],
              function (a,b) { return a+b; },
              self.totalLogoutTime);
        }
        self.averageLogoutTime = reportUtil.secondToTimeString(parseInt(
              reportUtil.strDurToSecond(self.totalLogoutTime) /
              self.totalLogout));
      }

      self.totalBreaktime = reportUtil.getTotalDuration(breaktimes);

      breaktimes.forEach(function (breaktime) {
        var idx = self.breaktimes.findIndex(function (brk) {
          return breaktime.activity === brk.activity;
        });

        if (idx === -1) {
          self.breaktimes.push(breaktime);
        } else {
          var brk = self.breaktimes[idx];
          var totalduration = reportUtil.getTotalDuration([brk, breaktime]);
          self.breaktimes[idx].duration = totalduration;
        }
      });
    }); // End of UserLogging

  delete opt.name;
  opt.nik = nik;
  TicketTagging.find(opt)
    .sort('-date')
    .exec(function (err, docs) {
      if (err) {
        console.log('Cannot fetch ticket tagging:', err.message);
        return;
      }
      self.noShow = Array.isArray(docs)? docs.filter(function (doc) {
        return doc.status === 'skipped';
      }).length : 0;
      self.totalTransaction = Array.isArray(docs)? docs.length : 0;
      self.totalServed = (self.noShow !== 0) ?
        (self.totalTransaction - self.noShow) :
        self.totalTransaction;
      self.totalTransactionTime = Array.isArray(docs)?
        reportUtil.getTotalDuration(docs) : '0';
      self.averageHandlingTime = (self.totalTransactionTime !== '0') ?
        reportUtil.secondToTimeString(
          parseInt(reportUtil.strDurToSecond(self.totalTransactionTime) /
            self.totalTransaction)) :
        '0';
      var activeTime = reportUtil.strDurToSecond(self.logout) -
        reportUtil.strDurToSecond(self.login) -
        reportUtil.strDurToSecond(self.totalLogoutTime);
      var idleTime = activeTime - reportUtil.strDurToSecond(
          self.totalTransactionTime);
      self.idleTime = reportUtil.secondToTimeString(idleTime);
      self.idleTimePercentage = parseInt(idleTime / activeTime * 100);
    }); // End of TicketTagging
}

function createPerformanceData (name, nik, date, gallery) {
  var result: {
    date: date.$gte,

  // Staff info
    name: name,
    nik: nik,
    gallery: gallery || '',

  // Staff login and logout time
    login: '0',
    logout: '0',

  // Staff logout breakdown details
    totalLogout: 0,
    totalLogoutTime: '00:00:00',
    averageLogoutTime: '00:00:00',

  // Staff breaktime duration and its breakdown
    totalBreaktime: '',
    breaktimes: [],

  // Staff transaction info
    totalTransaction: 0,
    totalServed: 0,
    noShow: 0,
    totalTransactionTime: '',
    averageHandlingTime: ''

  if (result.gallery === '') {
    User.findOne({ name: name, nik: nik }, function (err, user) {
      if (err) {
        console.log('err finding user:', err.message);
        return;
      }
      result.gallery = user.gallery;
    });
  }

  var opt = {
    name: result.name
  };
  if (date) opt.date = date;
  UserLogging
    .find(opt)
    .sort('time')
    .exec(function (err, docs) {
      if (err) {
        console.log('Cannot retrieve user logs:', err.message);
        return;
      }

      var logins = docs.filter(function (doc) {
        return doc.activity === 'login';
      });

      var logouts = docs.filter(function (doc) {
        return doc.activity === 'logout';
      });
      
      var breaktimes = docs.filter(function (doc) {
        return doc.activity !== 'login' && doc.activity !== 'logout';
      });
      
      if (Array.isArray(logins) && logins.length >= 1)
        result.login = reportUtil.getTimeString(logins[0].time);

      if (Array.isArray(logouts) && logouts.length >= 1) {
        result.logout = reportUtil.getTimeString(
            logouts[logouts.length - 1].time);  // get last logout
        result.totalLogout = logouts.length;
        result.totalLogoutTime = '0';
        for (var idxout = 0, idxin = 1;
            idxout < logouts.length || idxin < logins.length;
            idxout++, idxin++) {
          var startTiming = logouts[idxout].time;
          var endTiming = logins[idxin].time;
          var diffTime = new Date(endTiming.getTime () -
              startTiming.getTime());
          var diffDuration = reportUtil.splitTime(
              diffTime, 'toUTCString', 4);
          result.totalLogoutTime = reportUtil.opDurations([
              result.totalLogoutTime, diffDuration],
              function (a,b) { return a+b; },
              result.totalLogoutTime);
        }
        result.averageLogoutTime = reportUtil.secondToTimeString(parseInt(
              reportUtil.strDurToSecond(result.totalLogoutTime) /
              result.totalLogout));
      }

      result.totalBreaktime = reportUtil.getTotalDuration(breaktimes);

      breaktimes.forEach(function (breaktime) {
        var idx = result.breaktimes.findIndex(function (brk) {
          return breaktime.activity === brk.activity;
        });

        if (idx === -1) {
          result.breaktimes.push(breaktime);
        } else {
          var brk = result.breaktimes[idx];
          var totalduration = reportUtil.getTotalDuration([brk, breaktime]);
          result.breaktimes[idx].duration = totalduration;
        }
      });
    }); // End of UserLogging

  delete opt.name;
  opt.nik = nik;
  TicketTagging.find(opt)
    .sort('-date')
    .exec(function (err, docs) {
      if (err) {
        console.log('Cannot fetch ticket tagging:', err.message);
        return;
      }
      result.noShow = Array.isArray(docs)? docs.filter(function (doc) {
        return doc.status === 'skipped';
      }).length : 0;
      result.totalTransaction = Array.isArray(docs)? docs.length : 0;
      result.totalServed = (result.noShow !== 0) ?
        (result.totalTransaction - result.noShow) :
        result.totalTransaction;
      result.totalTransactionTime = Array.isArray(docs)?
        reportUtil.getTotalDuration(docs) : '0';
      result.averageHandlingTime = (result.totalTransactionTime !== '0') ?
        reportUtil.secondToTimeString(
          parseInt(reportUtil.strDurToSecond(result.totalTransactionTime) /
            result.totalTransaction)) :
        '0';
      var activeTime = reportUtil.strDurToSecond(result.logout) -
        reportUtil.strDurToSecond(result.login) -
        reportUtil.strDurToSecond(result.totalLogoutTime);
      var idleTime = activeTime - reportUtil.strDurToSecond(
          result.totalTransactionTime);
      result.idleTime = reportUtil.secondToTimeString(idleTime);
      result.idleTimePercentage = parseInt(idleTime / activeTime * 100);
    }); // End of TicketTagging
  return result;
}

module.exports = createPerformanceData;
