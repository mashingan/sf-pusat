/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var gallery = require('./gallery.model');

exports.register = function(socket,socketio) {
	 

  gallery.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  gallery.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  gallery.find({},function(err,gal){

    for(var i=0; i < gal.length; i++){
       /* socket cannel for tvdisplay */
      socket.on('tvdisplay:running_text:'+gal[i]._id, function(data){
        socketio.emit('tvdisplay:running_text:'+gal[i]._id, data);
      });
      socket.on('tvdisplay:counter_list:'+gal[i]._id, function(data){
        socketio.emit('tvdisplay:counter_list:'+gal[i]._id, data);
      });
      socket.on('tvdisplay:waiting_list:'+gal[i]._id, function(data){
        socketio.emit('tvdisplay:waiting_list:'+gal[i]._id, data);
      });
      socket.on('agent:waiting_list:'+gal[i]._id, function(data){
        socketio.emit('agent:waiting_list:'+gal[i]._id, data);
      });
      socket.on('agent:recall_customer:'+gal[i]._id, function(data){
        socketio.emit('agent:recall_customer:'+gal[i]._id, data);
      });
      for(var a=1; a < (gal[i].counter_count+1); a++){

        socket.on('agent:current_customer:'+gal[i]._id+':'+a, function(data){
          socketio.emit('agent:current_customer:'+gal[i]._id+':'+a, data);
        });
        socket.on('agent:incoming_transfer_customer:'+gal[i]._id+':'+a, function(data){
          socketio.emit('agent:incoming_transfer_customer:'+gal[i]._id+':'+a, data);
        });
      }

    }  

  });


}

function onSave(socket, doc, cb) {
  socket.emit('gallery:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('gallery:remove', doc);
}
