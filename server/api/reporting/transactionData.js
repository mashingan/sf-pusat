var EventEmitter = require('events').EventEmitter;
var TicketTagging = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');
var TicketTransaction = require('../cst_ticket/cst_ticket.model');
var User = require('../user/user.model');
var Gallery = require('../gallery/gallery.model');
var TaggingCode = require('../tagging_transaction/' +
    'tagging_transaction.model');

var reportUtil = require('./reporting.util');
var reportData = require('./reporting.data');

function TransactionData (tag) {
  var emitter = new EventEmitter();
  var self = this;

  self.date = tag.date;

  // Staff info, fetched from User
  self.nik = tag.agent;
  self.name = '';
  self.gallery = tag.gallery;
  self.region = '';

  // Ticket info, fetched from TicketTransaction
  self.mdn = '';
  self.service = '';
  self.ticketNumber = '';
  self.printedAt = '';
  self.calledAt = reportUtil.getTimeString(tag.time);     // str date
  self.closedAt = '';
  self.waitingTime = '';
  self.handlingTime = tag.duration;
  self.totalTime = '';

  // Tagging info, fetched from TaggingCode
  self.taggingCode = tag.tagging_code;
  self.tagLevel1 = '';
  self.tagLevel2 = '';
  self.tagLevel3 = '';
  self.tagLevel4 = '';

  emitter.once('last-query', function () {
    Gallery.find({ name: self.gallery }, function (err, gal) {
      self.region = gal.region;
    });
    User.findOne({ gallery: self.gallery, nik: self.nik },
      function (err, user) {
        self.name = user.name;
      });
    TaggingCode.findOne({ tagging_code: tag.tagging_code },
      function (err, tag) {
        for (var i = 1; i <= 4; i++)
          self['tagLevel' + i] = tag['level_' + i];
      });
  });

  var ticketOptions = {}
  ticketOptions.date = reportUtil.getDate(tag.date.toLocaleDateString());
  ticketOptions.customer = tag.customer;
  ticketOptions.gallery = tag.gallery;
  ticketOptions.proceedBy.nik = tag.agent;
  TicketTransaction.find(ticketOptions, function (err, ticket) {
    self.mdn = ticket.mdn;
    self.service = ticket.type_of_service;
    self.ticketNumber = ticket.ticket_number;
    self.printedAt = reportUtil.getTimeString(ticket.printedAt);
    self.waitingTime = reportUtil.opDurations([
        self.calledAt, self.printedAt], function (a,b){ return a-b; }, 0);
    self.totalTime = reportUtil.opDurations([
        self.waitingTime, self.handlingTime],
        function (a,b) { return a+b; }, 0);
    self.closedAt = reportUtil.opDurations([
        self.printedAt, self.totalTime], function (a,b){ return a+b; }, 0);
    emitter.emit('last-query');
  });

}

function transactionsInfo(res, when, where, who, mindata, maxdata) {
  var emitter = new EventEmitter();
  var toReturn = reportData.transactionData;
  toReturn.data = [];
  var [placeInfo, placeName] =
    (where && typeof where.split === 'function' &&
     ( where.includes('gallery') || where.includes('region'))) ?
    where.split(':') : [];
  var galleries = [];
  var elemCounter = 0;

  emitter.once('done', function () {
    res.status(200).json(toReturn);
  });

  emitter.once('populate-data', function () {
    var date = (when && typeof when.split) ?
      when.split(':').map(function (dt) { return new Date(dt); }) :
      [reportUtil.getToday(), reportUtil.getTomorrow()];
    var [from, to] = date.map(function (e) { return e.getTime(); });

    var ticketTagging = TicketTagging.find();
    var filters = {};
    filters.$or = {};
    if (galleries.length > 0) {
      galleries.forEach(function (el) {
        filters.$or.push({ gallery: el });
      });
      ticketTagging = ticketTagging.or(filters);
    }

    if (to) {
      while (to >= from && elemCounter < maxdata) {
        var dt = reportUtil.getDate(to);
        ticketTagging.or(dt).exec(taggingQuery);
        to -= reportUtil.ONEDAY;
      }
    } else {
      ticketTagging.or(reportUtil.getDate(from)).exec(taggingQuery);
    }
    emitter.emit('done');
  });

  function taggingQuery (err, tagged) {
    tagged = Array.isArray(tagged) ? tagged: [tagged];
    tagged.forEach(function (tag) {
      var user;
      if (who && who !== '-') {
        User.find({ name: who }, function (erruser, foundUser) {
          user = foundUser;
        });
      }
      if (elemCounter >= mindata && elemCounter < maxdata) {
        if ((!who || who === '-') || !user ||
            user.gallery === tag.gallery)
        {
          toReturn.data.push(new TransactionData(tag));
          elemCounter++;
        }
      }
    });
    if (elemCounter >= maxdata) emitter.emit('done');
  }

  // Getting all galleries if defined region
  if (placeInfo === 'region') {
    Gallery.find({ region: placeName }, function (err, galls) {
      galleries = Array.isArray(galls) ? galls : [galls];
      emitter.emit('populate-data');
    });
  } else if (placeInfo === 'gallery') {
    galleries = [placeName];
    emitter.emit('populate-data');
  }
}

module.exports = transactionsInfo;
