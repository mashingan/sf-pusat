'use strict';

var _ = require('lodash');
var Productivity = require('./productivity.model');
var config = require('../../config/environment');
var moment = require('moment');

// Get list of productivitys
exports.index = function (req, res) {
  var date = moment().format('YYYY-MM-DD');
  Productivity.findOne({date:date},function(err,productivity){
    if(err) return res.status(500).send(err);
    if(!productivity) Productivity.create({date:date},function(err,productivity){
      if(err) return res.status(500).send(err);
      _next();
    }); else _next();
  })

  function _next(){
    Productivity
      .find({})
      .sort({date: -1})
      .limit(config.limit.productivity || 30)
      .exec(function (err, productivitys) {
        if (err) return handleError(res, err);
        var result = JSON.parse(JSON.stringify(productivitys)).map(function (d) {
          d.customerTransaction.waiting = d.customerTransaction.walkIn - (d.customerTransaction.answer + d.customerTransaction.walkAway);
          return d;
        })
        return res.status(200).json(result);
      });
  }
};

// Get a single productivity
exports.show = function (req, res) {
  Productivity.findById(req.params.id, function (err, productivity) {
    if (err) {
      return handleError(res, err);
    }
    if (!productivity) {
      return res.status(404).send('Not Found');
    }
    return res.json(productivity);
  });
};

// Creates a new productivity in the DB.
exports.create = function (req, res) {
  Productivity.create(req.body, function (err, productivity) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(productivity);
  });
};

// Updates an existing productivity in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Productivity.findById(req.params.id, function (err, productivity) {
    if (err) {
      return handleError(res, err);
    }
    if (!productivity) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(productivity, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(productivity);
    });
  });
};

// Deletes a productivity from the DB.
exports.destroy = function (req, res) {
  Productivity.findById(req.params.id, function (err, productivity) {
    if (err) {
      return handleError(res, err);
    }
    if (!productivity) {
      return res.status(404).send('Not Found');
    }
    productivity.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}
