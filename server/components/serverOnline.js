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
var querystring = require('querystring');

module.exports = function (req, res, next) {
    
	// var data = querystring.stringify();
 //    var options = {
 //          host : '188.166.211.233',
 //          port: 3000,
 //          path : '/api/env/ping',
 //          method: 'GET',
 //    };

	// var result = '';

	// var request = http.request(options, function(response) {

 //      response.setEncoding('utf8');
 //      response.on('data', function (chunk) {
 //          result += chunk;
 //      });
 //      response.on('end', function () {
        
 //      	var data_parse =  JSON.parse(result);

 //      	req.online = data_parse.status;
      
 //      	next();
        
 //      });

	// });

	// request.on('error', function(e) {

	//     req.online = false;
      
 //      	next();

	// });

	// request.write(data);
	// request.end();

    

};