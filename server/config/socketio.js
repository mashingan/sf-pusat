/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');

// When the user disconnects.. perform this
function onDisconnect(socket) {


}

// When the user connects.. perform this
function onConnect(socket, socketio) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
 
  require('../api/gallery/gallery.controller').socketHandler(socket,socketio);
  require('../api/user/user.controller').socketHandler(socket,socketio);
  require('../api/customer/customer.controller').socketHandler(socket,socketio);
  require('../api/transfer_customer/transfer_customer.controller').socketHandler(socket,socketio);
  require('../api/type_of_service/typeofservice.controller').socketHandler(socket,socketio);
  require('../api/handset_type/handset_type.controller').socketHandler(socket,socketio);
  require('../api/province/province.controller').socketHandler(socket,socketio);
  require('../api/role/role.controller').socketHandler(socket,socketio);
  require('../api/city/city.controller').socketHandler(socket,socketio);
  require('../api/tagging_transaction/tagging_transaction.controller').socketHandler(socket,socketio);
  require('../auth/auth.service').socketHandler(socket,socketio);
  require('../api/cst_ticket/cst_ticket.controller').socketHandler(socket,socketio);
  require('../api/customer_tagging_transaction/customer_tagging_transaction.controller').socketHandler(socket,socketio);
  require('../api/user_activity/user_activity.controller').socketHandler(socket,socketio);
  require('../api/configuration/configuration.controller').socketHandler(socket,socketio);

}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket, socketio);
    console.info('[%s] CONNECTED', socket.address);
  });
};