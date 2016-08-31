/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var typeofservice = require('./typeofservice.model');

exports.register = function(socket) {
  typeofservice.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  typeofservice.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('typeofservice:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('typeofservice:remove', doc);
}
