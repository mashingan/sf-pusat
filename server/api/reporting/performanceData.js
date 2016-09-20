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

      let logins = docs.filter(function (doc) {
        return doc.activity === 'login';
      });

      let logouts = docs.filter(function (doc) {
        return doc.activity === 'logout';
      });
      
      let breaktimes = docs.filter(function (doc) {
        return doc.activity !== 'login' && doc.activity !== 'logout';
      });
      
      if (Array.isArray(logins) && logins.length >= 1)
        self.login = reportUtil.getTimeString(logins[0].time);

      if (Array.isArray(logouts) && logouts.length >= 1) {
        self.logout = reportUtil.getTimeString(
            logouts[logouts.length - 1].time);  // get last logout
        self.totalLogout = logouts.length;
        self.totalLogoutTime = '0';
        for (let idxout = 0, idxin = 1;
            idxout < logouts.length || idxin < logins.length;
            idxout++, idxin++) {
          let startTiming = logouts[idxout];
          let endTiming = logins[idxin];
          let diffTime = new Date(endTiming.getTime () -
              startTiming.getTime());
          let diffDuration = reportUtil.splitTime(
              diffTime, 'toUTCString', 4);
          self.totalLogoutTime = reportUtil.secondToTimeString(
              reportUtil.strDurToSecond(self.totalLogoutTime) +
              reportUtil.strDurToSecond(diffDuration));
        }
        self.averageLogoutTime = reportUtil.secondToTimeString(parseInt(
              reportUtil.strDurToSecond(self.totalLogoutTime) /
              self.totalLogout));
      }

      self.totalBreaktime = reportUtil.getTotalDuration(breaktimes);

      breaktimes.forEach(function (breaktime) {
        let idx = self.breaktimes.findIndex(function (brk) {
          return breaktime.activity === brk.activity;
        });

        if (idx === -1) {
          self.breaktimes.push(breaktime);
        } else {
          let brk = self.breaktimes[idx];
          let totalduration = reportUtil.getTotalDuration([brk, breaktime]);
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
      let activeTime = reportUtil.strDurToSecond(self.logout) -
        reportUtil.strDurToSecond(self.login) -
        reportUtil.strDurToSecond(self.totalLogoutTime);
      self.idleTime = reportUtil.secondToTimeString(activeTime -
          reportUtil.strDurToSecond(self.totalTransactionTime));
      self.idleTimePercentage = parseInt(
          reportUtil.strDurToSecond(self.idleTime) / activeTime * 100);
    }); // End of TicketTagging
}

module.exports = PerformanceData;
