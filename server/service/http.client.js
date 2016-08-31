/**
 * Created by dwiargo on 7/19/16.
 */
var http = require('http');
var https = require('https');
var querystring = require('querystring');

exports.request = function(options,callback,data){
  var data = data ? JSON.stringify(data) : null;
  var prot = options.port == 443 ? https:http;
  var req = prot.request(options,function(res){
    var output = '';
    res.setEncoding('utf8');

    res.on('data',function(chunk){
      output += chunk;
    })

    res.on('end',function(){
      output = res.statusCode === 200 ? JSON.parse(output) : output;
      callback(res.statusCode,output);
    })
  })

  req.on('error',function(err){
    callback(500,err);
    //if(_res) _res.send(err);
  });
  if(data) req.write(data);

  req.end();
};
