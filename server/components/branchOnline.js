/*
 * This component is for handling the case when the connection between
 * the client and the central server cut.
 *
 * This component works as a middleware and will be added only in
 * central servers.
 *
 * This middleware has components such as:
 * 1. Handler for socket event for 'server-pusat-online'.
 * 2. http.request for saving the pending transaction within gallery into
 * central server database.
 * 3. Drop database for pending transactions.
 */

var http = require('http');
var tickets = require('../api/cst_ticket/cst_ticket.model.js');
var mongoose = require('mongoose');
var Socket = null;

module.exports.socketHandler = function (socket, socketio) {
    Socket = socketio;
};

module.exports = function (req, res, next) {
    Socket.on('server-pusat-online', function () {
        req.pending = false;
        next();
        return;
    });

    req.pending = true; // take it to process the tickets
    next();
};
