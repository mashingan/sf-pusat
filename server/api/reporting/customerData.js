var EventEmitter = require('events').EventEmitter;
var TypeOfService = require('../type_of_service/typeofservice.model');
var TicketTransaction = require('../cst_ticket/cst_ticket.model');
var Gallery = require('../gallery/gallery.model');
var TaggingTransaction = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');

var reportData = require('./reporting.data');
var reportUtil = require('./reporting.util');

function createCustomerData (date, tickets) {

  var result = {
    date: date.$gte,
    region: '',   // got from Gallery
    gallery: tickets[0].gallery,
    visitor: 0,
    served: 0,
    skipped: 0,
    withinSL: 0,
    services: [], 
    totalCSR: 0
  }

  Gallery.findOne({ gallery: tickets[0].gallery },
      function (err, gallery) {
        result.region = gallery.region;
      });

  function filterWith(label) {
    return function (a, b) {
      if (b.status === label) return a+1;
      else return a;
    };
  }

  result.served = tickets.reduce(filterWith('done'), 0);
  result.skipped = tickets.reduce(filterWith('skipped'), 0);
  result.visitor = result.served + result.skipped;

  result.services = tickets.reduce(function (a, b) {
    var idx = a.findIndex(function (ticket) {
      return a.service === b.type_of_service;
    });
    if (idx === -1) {
      a.push({ service: b.type_of_service, count: 0 });
    } else {
      a[idx][b.count]++;
    }
    return a;
  }, []);

  result.totalCSR = result.services.reduce(function (a, b) {
    return a + b.count;
  }, 0);

  var ticketNumbers = tickets.reduce(function (a, b) {
    if (!(a.includes(b.ticket_number)))
      a.push(b.ticket_number);
    return a;
  }, []);

  TaggingTransaction.find({ queuing_number: { $in: ticketNumbers },
    date: date, exceeding_sla: false }, function (err, transactions) {
      transactions = Array.isArray(transactions) ?
        transactions: [transactions];
      result.withinSL = transactions.reduce(function (a, b) {
        if (a.includes(b.queuing_number)) a.push(b.queuing_number);
        return a;
      }, []).length / result.visitor * 100;
    });

  return result;

}

function customersInfo (res, when, where, mindata, maxdata) {
  var emitter = new EventEmitter();
  var result = reportData.customerData;
  result.data = [];
  result.services = [];
  var galleries = [];
  var elemCounter = 0;

  emitter.once('done', function () {
    res.status(200).json(result);
  });

  emitter.once('populate-data', function () {
    var [from, to] = reportUtil.getFromTo(when);

    var dt;
    var i = 0;
    var gallery;
    if (to) {
      while (to >= from && elemCounter < maxdata) {
        dt = reportUtil.getDate(to);
        for (i = 0; i < galleries.length; i++) {
          gallery = galleries[i];
          TicketTransaction.find({ gallery: gallery, date: dt},
              ticketConsumer(dt));
        }

        to -= reportUtil.ONEDAY;
      }
    } else {
      dt = reportUtil.getDate(from);
      for (i = 0; i < galleries.length; i++) {
        gallery = galleries[i];
        TicketTransaction.find({ gallery: gallery, date: dt },
            ticketConsumer(dt));
      }
    }

    emitter.emit('done');
  });
  
  function ticketConsumer(date) {
    return function (err, tickets) {
      tickets = Array.isArray(tickets) ? tickets : [tickets];
      if (reportUtil.testCounter({ counter:elemCounter,
        min:mindata, max:maxdata}))
        result.data.push(createCustomerData(date, tickets));
      elemCounter++;
      if (elemCounter >= maxdata) emitter.emit('done');
    };
  }


  TypeOfService.distinct('name', function (err, tos) {
    result.services = Array.isArray(tos)? tos : [tos];
  });

  reportUtil.getGalleries(where).then(function (result) {
    galleries = result;
    emitter.emit('populate-data');
  }, function (failed) {
    galleries = failed;
    emitter.emit('populate-data');
  });
}

module.exports = customersInfo;
