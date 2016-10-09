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

function createTransactionData (tag) {

  var result = {
    date: tag.date,

  // Staff info, fetched from User
    nik: tag.agent,
    name: '',
    gallery: tag.gallery,
    region: '',

  // Ticket info, fetched from TicketTransaction
    mdn: '',
    service: '',
    ticketNumber: '',
    printedAt: '',
    calledAt: reportUtil.getTimeString(tag.time),     // str date
    closedAt: '',
    waitingTime: '',
    handlingTime: tag.duration,
    totalTime: '',

  // Tagging info, fetched from TaggingCode
    taggingCode: tag.tagging_code,
    tagLevel1: '',
    tagLevel2: '',
    tagLevel3: '',
    tagLevel4: ''
  }

  Gallery.find({ name: tag.gallery }, function (err, gal) {
    result.region = gal.region;
  });

  User.findOne({ gallery: tag.gallery, nik: tag.agent },
      function (err, user) {
        result.name = user.name;
      });

  TaggingCode.findOne({ tagging_code: tag.tagging_code },
      function (err, tagged) {
        for (var i = 1; i <= 4; i++) {
          result['tagLevel' + i] = tagged['level_' + i];
        }
      });

  var ticketOptions = {
    date: reportUtil.getDate(tag.date.toLocaleDateString()),
    customer: tag.customer,
    gallery: tag.gallery,
    proceedBy: { nik: tag.agent }
  };

  TicketTransaction.find(ticketOptions, function (err, ticket) {
    result.mdn = ticket.mdn;
    result.service = ticket.type_of_service;
    result.ticketNumber = ticket.ticket_number;
    result.printedAt = reportUtil.getTimeString(ticket.printedAt);
    result.waitingTime = reportUtil.opDurations([result.printedAt],
      function (a,b){ return a-b; }, result.calledAt);
    result.totalTime = reportUtil.opDurations([result.waitingTime],
      function (a,b){ return a+b; }, result.handlingTime);
    result.closedAt = reportUtil.opDurations([result.totalTime],
      function (a,b){ return a+b; }, result.printedAt);
  });
  return result;
}

function transactionsInfo(res, when, where, who, mindata, maxdata) {
  var emitter = new EventEmitter();
  var toReturn = reportData.transactionData;
  toReturn.data = [];
  var galleries = [];
  var elemCounter = 0;

  emitter.once('done', function () {
    res.status(200).json(toReturn);
  });

  emitter.once('populate-data', function () {
    var [from, to] = reportUtil.getFromTo(when);

    var ticketTagging;
    reportUtil.galleryFilteredQuery(TicketTagging, galleries)
      .then(function (result) {
        ticketTagging = result;
      }, function (notFiltered) {
        ticketTagging = notFiltered;
      });

    if (to) {
      while (to >= from && elemCounter < maxdata) {
        var dt = reportUtil.getDate(to);
        ticketTagging.or({ date: dt }).exec(taggingQuery);
        to -= reportUtil.ONEDAY;
      }
    } else {
      ticketTagging.or({date:reportUtil.getDate(from)}).exec(taggingQuery);
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
      if (reportUtil.testCounter({ min: mindata, max: maxdata, who: who,
        user: user, tag: tag, counter: elemCounter }))
      {
        toReturn.data.push(createTransactionData(tag));
      }
      elemCounter++;
      if (elemCounter >= maxdata) emitter.emit('done');
    });
  }

  // Getting all galleries if defined region
  reportUtil.getGalleries(where).then(function (success) {
    galleries = success;
    emitter.emit('populate-data');
  }, function (failed) {
    galleries = failed;
    emitter.emit('populate-data');
  });
}

module.exports = transactionsInfo;
