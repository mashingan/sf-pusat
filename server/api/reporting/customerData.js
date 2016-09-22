var EventEmitter = require('events').EventEmitter;
var TypeOfService = require('../type_of_service/typeofservice.model');
var TicketTransaction = require('../cst_ticket/cst_ticket.model');
var Gallery = require('../gallery/gallery.model');
var TaggingTransaction = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');

var reportData = require('./reporting.data');
var reportUtil = require('./reporting.util');

function CustomerData (date, tickets) {
  var self = this;

  self.date = date.$gte;
  self.region = '';   // got from Gallery
  self.gallery = tickets[0].gallery;
  self.visitor = 0;
  self.served = 0;
  self.skipped = 0;
  self.withinSL = 0;
  self.services = []; 
  self.totalCSR = 0;

  Gallery.findOne({ gallery: tickets[0].gallery },
      function (err, gallery) {
        self.region = gallery.region;
      });

  self.served = tickets.reduce(function (a, b) {
    if (b.status === 'done') return a+1;
    else return a;
  }, 0);

  self.skipped = tickets.reduce(function (a, b) {
    if (b.status === 'skipped') return a+1;
    else return a;
  }, 0);

  self.visitor = self.served + self.skipped;

  self.services = tickets.reduce(function (a, b) {
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

  self.totalCSR = self.services.reduce(function (a, b) {
    return a + b.count;
  }, 0);

  var ticketNumbers = tickets.reduce(function (a, b) {
    if (a.includes(b.ticket_number))
      a.push(b.ticket_number);
    return a;
  }, []);

  TaggingTransaction.find({ queuing_number: { $in: ticketNumbers },
    date: date, exceeding_sla: false }, function (err, transactions) {
      transactions = Array.isArray(transactions) ?
        transactions: [transactions];
      self.withinSL = transactions.reduce(function (a, b) {
        if (a.includes(b.queuing_number)) a.push(b.queuing_number);
        return a;
      }, []).length / self.visitor * 100;
    });


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
        result.data.push(new CustomerData(date, tickets));
      elemCounter++;
      if (elemCounter >= maxdata) emitter.emit('done');
    };
  }


  TypeOfService.distinct('name', function (err, tos) {
    result.services = Array.isArray(tos)? tos : tos;
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
