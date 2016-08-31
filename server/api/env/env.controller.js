'use strict';

var _ = require('lodash');

exports.check_master_server = function(req, res) {

	 if(req.online){
	 	return res.status(200).json({ online : true});
	 }else{
	 	return res.status(200).json({ online : false});
	 }		
  	 
 
};

exports.ping = function(req, res) {

	return res.status(200).json({ status : true });

}	