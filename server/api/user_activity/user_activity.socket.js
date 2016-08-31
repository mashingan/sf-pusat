/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var UserActivity = require('./user_activity.model');

var moduls = ['gallery', 'type_of_service', 'city', 'province', 'tagging_transaction', 'user', 'handset_type'];

exports.register = function(socket) {
	 

  UserActivity.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  UserActivity.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  socket.on('activity:user', function(data){
      socket.emit('activity:user', data);
  });

  socket.on('user:online', function(data){
      socket.emit('user:online', data);
  });

  for(var i=0;i < moduls.length; i++){

    socket.on('activity:modul:'+ moduls[i], function(data){
        socket.emit('activity:modul:'+ moduls[i], data);
    });

  }


}

function onSave(socket, doc, cb) {
  socket.emit('user_activity:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('user_activity:remove', doc);
}
