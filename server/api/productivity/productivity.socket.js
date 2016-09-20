/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Productivity = require('./productivity.model');

exports.register = function(socket) {
  Productivity.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Productivity.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('productivity:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('productivity:remove', doc);
}