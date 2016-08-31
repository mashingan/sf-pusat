/* global io */
'use strict';

angular.module('smartfrenApp')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    socket.forward('error');

    return socket;
    
  });
