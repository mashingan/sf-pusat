var EventEmitter = require('events').EventEmitter;
var TypeOfService = require('../type_of_service/typeofservice.model');
var TicketTransaction = require('../cst_ticket/cst_ticket.model');
var Gallery = require('../gallery/gallery.model');
var TaggingTransaction = require('../customer_tagging_transaction/' +
    'customer_tagging_transaction.model');

var reportData = require('./reporting.data');
var reportUtil = require('./reporting.util');

function createCustomerData (date, tickets) {
  return new Promise(function (resolve, reject) {
    var emitter = new EventEmitter();

    var result = {
      date: date? date.$gte : tickets[0].date,
      region: '',   // got from Gallery
      gallery: tickets[0].gallery,
      visitor: 0,
      served: 0,
      skipped: 0,
      withinSL: 0,
      services: [], 
      totalCSR: 0
    }

    var taggingDone = false;
    var galleryDone = false;
    var etcDone = false;

    emitter.on('all-done', function () {
      if (taggingDone && galleryDone && etcDone)
        resolve(result);
    });

    emitter.on('gallery-done', function () {
      galleryDone = true;
      emitter.emit('all-done');
    });

    Gallery.findOne({ gallery: tickets[0].gallery },
        function (err, gallery) {
          if (gallery) result.region = gallery.region;
          emitter.emit('gallery-done');
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
        return ticket.service === b.type_of_service;
      });
      if (idx === -1) {
        a.push({ service: b.type_of_service, count: 0 });
      } else {
        a[idx].count++;
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

    etcDone = true;

    emitter.on('tagging-done', function () {
      taggingDone = true;
      emitter.emit('all-done');
    });

    TaggingTransaction.find({ queuing_number: { $in: ticketNumbers },
      date: date, exceeding_sla: false }, function (err, transactions) {
        transactions = Array.isArray(transactions) ?
          transactions: [transactions];
        result.withinSL = transactions.reduce(function (a, b) {
          if (a.includes(b.queuing_number)) a.push(b.queuing_number);
          return a;
        }, []).length / result.visitor * 100;
        emitter.emit('tagging-done');
      });
  });
}


function customersInfo (when, where, mindata, maxdata) {
  var emitter = new EventEmitter();
  var result = reportData.customerData;
  result.data = [];
  result.services = [];
  var galleries = [];
  var elemCounter = 0;

  return new Promise (function (resolve, reject) {

    emitter.once('done', function () {
      //res.status(200).json(result);
      resolve(result);
    });

    emitter.once('populate-data', function () {
      var [from, to] = reportUtil.getFromTo(when);
      console.log('when:', when);
      console.log('from-to: %s-%s', from, to);

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
        var options = {};
        if (when !== 'all' && from)
          options.date = reportUtil.getDate(from);
        for (i = 0; i < galleries.length; i++) {
          options.gallery = galleries[i];
          console.log(options);
          if (options.date) {
            TicketTransaction.find(options, ticketConsumer(options.date));
          } else {
            TicketTransaction.aggregate([
                { $match: options },
                { $group: { _id: {date: '$date'},
                            data: { $push: { region: '$region',
                              status: '$status',
              ticket_number: '$ticket_number',
              queuing_number: '$queuing_number',
              gallery: '$gallery' }}}}],
              aggregateProcessor());
          }
        }
      }

      setTimeout(function () { emitter.emit('done'); }, 5000);

    });
  
    function ticketConsumer(date) {
      return function (err, tickets) {
        tickets = Array.isArray(tickets) ? tickets : [tickets];
        if (reportUtil.testCounter({ counter:elemCounter,
          min:mindata, max:maxdata})) {
          //result.data.push(createCustomerData(date, tickets));
          createCustomerData(date, tickets).then(function (success) {
            console.log(success);
            result.data.push(success); }, function (failed) {} );
        }
        elemCounter++;
        if (elemCounter >= maxdata) emitter.emit('done');
      };
    }

    function aggregateProcessor () {
      return function (err, aggr) {
        aggr.forEach(function (tickets) {
          if (reportUtil.testCounter({ counter: elemCounter,
            min:mindata, max:maxdata})) {
            createCustomerData(undefined, tickets).then(function (success) {
              result.data.push(success); }, function (failed) {});
            if (++elemCounter >= maxdata) emitter.emit('done');
          }
        });
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
  });
}

module.exports = customersInfo;
