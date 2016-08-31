/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cst_tickets              ->  index
 */

'use strict';

var moment = require('moment');
var path = require('path');
var CustomerTicket = require('./cst_ticket.model');
var Customer = require('../customer/customer.model');
var User = require('../user/user.model');
var Gallery = require('../gallery/gallery.model');
var Typeofservice = require('../type_of_service/typeofservice.model');
var CustomerTaggingTransaction = require('../customer_tagging_transaction/customer_tagging_transaction.model');
var TaggingTransaction = require('../tagging_transaction/tagging_transaction.model');
var httpClient = require('../../service/http.client');
var Socket = null;
var port = 9000;


exports.socketHandler = function (socket,socketio) {

    Socket = socketio; // attaching Socket to variable
    
};

function sendError (response, status, errmsg) {
    return response.status(status).json({
        'result': 'failed',
        message: errmsg
    });
}

function httpCallback(response, status, data) {
    if (status === 200)
        return response.status(200).send(data);
    else if (status === 404)
        return response.status(status).json({
            result: "failed",
            message: "Gallery is offline"
        });
    else
        return response.status(status).send(data);
}

function syncToLocal (err, opt, callback) {
    httpClient.request({
        host: opt.host,
        port: opt.port || port,
        path: opt.path,
        method: opt.method,
        header: {'Content-Type': 'application/json'}
    }, callback, opt.data);
}

//Sync
exports.localSync = function(req,res){
  var _idarr = Array.isArray(req.body) ? req.body.map(function(d){
    return d._id;
  }) : [req.body._id];
  
  CustomerTicket.remove({_id:{$in:_idarr}},function(err){
    if(err) return res.status(500).status(err);
    CustomerTicket.create(req.body,function(err,cstTicket){
      if(err) return res.status(500).send(err);
      if (cstTicket) {
        var result = Array.isArray(cstTicket) ? cstTicket : [cstTicket];
        console.log('result:', result);
        return res.status(200).json(result.map(function(d){
          console.log('d_result:', d);
          return d._id;
        }));
      }
      else return res.status(404).send('empty');
    })
  })
}

// Gets a list of CstTickets
exports.index = function(req, res) {

  var limit = req.params.limit || 10;
  var page = req.params.page || 1;
  var order = req.params.order || 'name';
  var offset = (page-1) * limit;

  if(req.params.filter){

    var re = new RegExp(req.params.filter, 'i');
    var filter = [
    	{ 'status': { $regex: re }},
    	{ 'gallery': { $regex: re }},
    	{ 'ticket_type': { $regex: re }},
    	{ 'customer': { $regex: re }}
    ];

  }else{

    var filter = '-';

  }

  var cstTickets = CustomerTicket.find({});
  if (req.params.filter !== '-') {
    cstTickets = cstTickets.or(filter);
  }
  cstTickets
    .sort(order)
    .skip(offset)
    .limit(limit)
    .exec(function (err, customer_tickets) {
      if (err) return res.status(200).json({
        result: 'failed',
        message: err.message
      });

      if (customer_ticket.length > 0)
        return res.status(200).json({
          result: 'success',
          message: 'success pull data!',
          data: customer_tickets
      });

      else
        return res.status(200).json({
          result: 'success',
          message: 'success pull data!',
          data: customer_tickets
      });
    });
/*
  if(req.params.filter!='-'){

    CustomerTicket.find({}, function (err, customer_tickets) {

      if(err){

          return res.status(200).json({ result : "failed", message : err});
      
      }

      if(customer_tickets.length > 0){

        return res.status(200).json({ result : "success", count : customer_tickets.length, message : 'success pull data!', data : customer_tickets});

      }else{

        return res.status(200).json({result : "failed", message : "Data is empty."});

      }

    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    CustomerTicket.find({}, function (err, customer_tickets) {

      if(err){

        return res.status(200).json({ result : "failed", message : err});
      
      }

      if(customer_tickets.length > 0){

        return res.status(200).json({ result : "success", count : customer_tickets.length, message : 'success pull data!', data : customer_tickets});

      }else{

        return res.status(200).json({ result : "failed", message : "Data is empty."});

      }

    })
    .sort(order)
    .skip(offset)
    .limit(limit);
    
  }
*/
}

exports.ticket_stat_count = function(req, res){

	var datenow = moment().format("YYYY-MM-DD");

	CustomerTicket.count({
		ticket_type: "mobile", 
		date: {
		      $gte: datenow,
		      $lt: moment(datenow).add(1, 'days')
		    }
		},function(err, count){


	    if(err){

	      res.status(200).json({result:"failed", message: "Server Error", err:log});

	    }else{

	      res.status(200).json({result:"success", count:count});

	    }


	});

}
exports.transaction_stat_count = function(req, res){

	var datenow = moment().format("YYYY-MM-DD");

	CustomerTicket.count({
		status: "done", 
		date: {
		      $gte: datenow,
		      $lt: moment(datenow).add(1, 'days')
		    }
		},function(err, count){


	    if(err){

	      res.status(200).json({result:"failed", message: "Server Error", err:log});

	    }else{

	      res.status(200).json({result:"success", count:count});

	    }


	});

}

exports.notif = function(req, res){

	var book_code = req.params.book_code;
	var datenow = moment().format('YYYY-MM-DD');
	var timenow = moment().format('HH:mm');

	CustomerTicket.findOne({book_code: book_code},function(err, ticket){


		if(ticket){
			if(ticket.date == datenow){

				var parse_time = ticket.time.split(":");
				var hour = parseInt(parse_time[0]);
				var minute = parseInt(parse_time[1]);
				var a = 0; 
				var b = 0;
				var notif_time = 0; 

				if(minute > 30){

					a = minute - 30; 
					if(a < 10){
						a = "0" + a.toString();
					}else{
						a = a.toString();
					}

					notif_time = hour.toString() + ":" + a;

				}else if(minute == 30){

					notif_time = hour.toString() + ":00";

				}else{

					b = 30 - minute;
					a = 60 - b;

					if(a < 10){
						a = "0" + a.toString();
					}else{
						a = a.toString();
					}

					notif_time = (hour-1).toString() + ":" + a;


				}

				if(timenow == notif_time){

					res.status(200).json({ result: "success", timeserver: timenow, timenotif: notif_time, booktime: ticket.time, message: "30 minute again you must be in Smartfren gallery!"});

				}else{

					res.status(200).json({ result: "failed", timeserver: timenow, timenotif: notif_time, booktime: ticket.time, message: "not now"});

				}


			}else{

				res.status(200).json({ result: "failed", timeserver: timenow, timenotif: notif_time, booktime: ticket.time, message: "not now"})

			}
		}else{

			res.status(200).json({ result: "failed", message: "Invalid book_code or book_status is completed"})

		}


	});


}

// Gets a list of CstTickets
exports.customer_booklist = function(req, res) {

  var customer_id = req.params.customer_id;
  var limit = req.params.limit || 10;
  var page = req.params.page || 1;
  var order = req.params.order || 'name';
  var offset = (page-1) * limit;
  var data = [];

  if(req.params.filter){

    var re = new RegExp(req.params.filter, 'i');
    var filter = [
    	{ 'status': { $regex: re }},
    	{ 'gallery': { $regex: re }},
    	{ 'ticket_type': { $regex: re }},
    	{ 'customer': { $regex: re }}
    ];

  }else{

    var filter = '-';

  }

  Customer.findById(customer_id, function (errcust, customer) {
    if (errcust) {
      return res.status(200).json({
        result: 'failed',
        message: errcust.message
      });
    }

    if (!customer) {
      return res.status(200).json({
        result: 'failed',
        message: 'customer_id not registered'
      });
    }

    var cstTickets = CustomerTicket.find({ customer: customer.username });
    if (req.params.filter !== '-') {
      cstTickets = cstTickets.or(filter);
    }
    cstTickets
      .sort(order)
      .skip(offset)
      .limit(limit)
      .exec(function (errtickets, tickets) {
        if (errtickets)
          return res.status(200).json({
            result: 'failed',
            message: errtickets.message
          });

        if (tickets.length > 0) {
          asyncLoop(0, tickets, function () {
            return res.status(200).json({
              result: 'success',
              message: 'successfully pulling data!',
              data: data
            });
          });
        }
        else {
          return res.status(200).json({
            result: 'success',
            message: 'successfully pulling data!'
          });
        }


      });

  });

/*
  if(req.params.filter!='-'){

  	Customer.findById(customer_id,function(e, customer){
  		if(!customer){
  			return res.status(200).json({ result : "failed", message : 'customer_id not registered.'});
  		}
  		CustomerTicket.find({customer: customer.username}, function (err, customer_tickets) {

	      if(err){

	          return res.status(200).json({ result : "failed", message : err});
	      
	      }

	      if(customer_tickets.length > 0){


	      	asyncLoop( 0, customer_tickets, function(){

	      		return res.status(200).json({result : "success", message : "successfully pull data!", data: data });	
	      	
	      	});

	      }else{

	        return res.status(200).json({result : "failed", message : "Data is empty."});

	      }

	    })
	    .or(filter)
	    .sort(order)
	    .skip(offset)
	    .limit(limit);

  	});

  }else{
  	
  	Customer.findById(customer_id,function(e, customer){

  		if(!customer){
  			return res.status(200).json({ result : "failed", message : 'customer_id not registered.'});
  		}
  		CustomerTicket.find({customer: customer.username}, function (err, customer_tickets) {

	      if(err){

	        return res.status(200).json({ result : "failed", message : err});
	      
	      }

	      if(customer_tickets.length > 0){

	        asyncLoop( 0, customer_tickets, function(){

	      		return res.status(200).json({result : "success", message : "successfully pull data!", data: data });	
	      	
	      	});

	      }else{

	        return res.status(200).json({ result : "failed", message : "Data is empty."});

	      }

	    })
	    .sort(order)
	    .skip(offset)
	    .limit(limit);

  	});
    
  }
*/
  function asyncLoop( i, customer_tickets, callback ) {

        var num_rows = customer_tickets.length;
        var gallery_pict = [];
        var hostname = req.headers.host;
        if( i < num_rows ) {
          
        
          Gallery.findOne({name : customer_tickets[i].gallery},function(err, gallery){


          	if(gallery.length > 0){
				var service = gallery.type_of_service.filter(function(a){ return a.name ==  customer_tickets[i].type_of_service})[0];
			}else{
				var service = { sla : 5 };
			}
			
			var estimate_waiting_time = parseInt(customer_tickets[i].queueing_number) * parseInt(service.sla);


          	for(var a=0; a < gallery.picture.length;a++){

          		gallery_pict.push("http://" + hostname + "/media/gallery/" + gallery.picture[a]);

          	}

          	data.push({ 

				customer : { 
					username : customer_tickets[i].customer
				},
				ticket_type : customer_tickets[i].ticket_type,
				book_code : customer_tickets[i].book_code,
				gallery : {
					name : customer_tickets[i].gallery,
					address : gallery.address,
					picture : gallery_pict
				},
				date :  customer_tickets[i].date,
				time :  customer_tickets[i].time,
				note :  customer_tickets[i].note,
				type_of_service :  customer_tickets[i].type_of_service,
				status : customer_tickets[i].status,
				queueing_number : customer_tickets[i].queueing_number,
				estimate_waiting_time : estimate_waiting_time

          	});

            asyncLoop( i+1, customer_tickets, callback );

          });
      
      	} else {

          callback();
      
      	}
  }
}
exports.book = function(req, res) {
    Gallery.findOne({name:req.body.gallery},function(err,gallery){
        //if(err) return res.status(500).send(err);
        if(err) return sendError(res, 500, err);

        //if(!gallery) return res.status(404).send('Gallery is not found');
        if(!gallery) return sendError(res, 404, 'Gallery is not found');

        if(gallery.ipAddress){
            httpClient.request({
                host: gallery.ipAddress,
		port: gallery.port || 9000,
		path: '/api/cst_tickets/book',
		method: 'post',
		headers: {'Content-Type': 'application/JSON'}
	    }, function(status,data){
               return httpCallback(res, status, data);
            },req.body);
        } else {
            //res.status(500).send('Service for this gallery is not available for now');
            sendError(res, 500,
                'Service for this gallery is not available for now');
        }
    })
}

exports.agent_call_customer = function(req, res){

	/* define gallery and counter active */
	var gallery = req.body.gallery;
	var counter = req.body.counter;
	var data_counter_list = [];
	var data_waiting_list = [];
	/* find customer waiting list */

	Gallery.findById(gallery, function(err, data){
		
		if(err){
		
			res.status(200).json({ result: "failed", message: "Server Error", log: err }); 
		
		}
		if(data){

			CustomerTicket.findOne({ status: "waiting", gallery: data.name }).sort('queueing_number').exec(function(err, customer_ticket){
				
				if(customer_ticket){

					/* update next customer status to be process */
					customer_ticket.status = 'process';
					customer_ticket.counter = counter;

					customer_ticket.save(function(err){

						/* find service tag */
						Typeofservice.findOne({name : customer_ticket.type_of_service},function(err, service){
		          
							/* find gallery id for socket channel */
				            Gallery.findOne({name : customer_ticket.gallery},function(err, gallery){

				            	/* send data to update current customer on socket channel agent:current_customer */
				              	Socket.emit("agent:current_customer:"+gallery._id+":"+customer_ticket.counter, 
					              { 
					              	id : customer_ticket._id, 
					              	customer : customer_ticket.customer, 
					              	queueing_number : String(customer_ticket.queueing_number) + service.tag,
					              	counter: customer_ticket.counter
					              }
				              	); 

				              	/* update tv display data */

						        CustomerTicket.find({gallery : customer_ticket.gallery, status : 'process', date: customer_ticket.date},function(err, customer_tickets){

						   			asyncLoop2( 0, customer_tickets ,'process', function() {

						   				Socket.emit("tvdisplay:counter_list:"+gallery._id, data_counter_list); 

						   			});	
						   			

								});	

								CustomerTicket.find({gallery : customer_ticket.gallery, status : 'waiting', date: customer_ticket.date},function(err, customer_tickets){

						   			asyncLoop2( 0, customer_tickets ,'waiting', function() {

						   				Socket.emit("tvdisplay:waiting_list:"+gallery._id, data_waiting_list); 

						   			});	
						   			

								});	

				            });

				        });

						res.status(200).send("ok");

					});
					
						
				}else{

					res.status(200).json({ result: "failed", message: "No waiting customer found!"});

				}
			});

		}else{

			res.status(200).json({ result: "failed", message: "Invalid gallery_id!"}); 
		
		}
		
	});
	
	function asyncLoop2( i, customer_tickets, status,  callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
            if(status=="process"){	

              data_counter_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter
              });  

            }else{

              data_waiting_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              });  

           	} 	
            
            asyncLoop2( i+1, customer_tickets, status, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}
}
exports.kiosk_new_customer = function(req, res){

	var customer = req.body.name;
	var gallery = req.body.gallery;
	var type_of_service = req.body.type_of_service;
	var ticket_type = "regular";
	var date = moment().format('YYYY-MM-DD');
	var time = moment().format('HH:mm');
	var customer_status = "waiting";
	var data_waiting_list = [];
	var data_waiting = [];

	if(customer==""){
		return;
	}
	if(gallery==""){
		return;
	}
	if(type_of_service==""){
		return;
	}
	
	CustomerTicket.findOne({
		gallery : gallery, 
		status : { '$ne': 'done' }, 
		date: {
			      $gte: date,
			      $lt: moment(date).add(1, 'days')
			    }
	}).sort('-queueing_number').exec(function(err_1, last_qn){

		/* create incremental queueing_number */

		var queueing_number = 1;

		if(last_qn){

			queueing_number = last_qn.queueing_number + 1;
		
		}

		req.body.queueing_number = queueing_number;

		Gallery.findOne({name : gallery},function(err_3, gal){

			/* create estimate waiting time from service sla config per gallery */

			if(gal.length > 0){
				var service = gal.type_of_service.filter(function(a){ return a.name == type_of_service})[0];
			}else{
				var service = { sla : 5 };
			}
			
			var queueing_count = 1;
			if(last_qn){
				queueing_count = last_qn.queueing_number + 1;
			}
			var estimate_waiting_time = (parseInt(queueing_count)-1) * parseInt(service.sla);


			req.body.ticket_type = ticket_type;
			req.body.date = date;
			req.body.time = time;
			req.body.customer = customer;
			req.body.status = customer_status;

			var hostname = req.headers.host;
			var uniqcode = Math.floor(Math.random() * 90000) + 10000;

			if(req.body.picture){

			    var uuid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
			    require("fs").writeFile(path.join(__dirname,"../../../client/media/customer/" + uuid + ".jpg"), req.body.picture, 'base64', function(err) {
			        if(err){
			          return res.status(200).json({ result : "failed", message: "Upload failed.", log : err });
			        }
			    });

			    req.body.picture =  uuid + ".jpg";
			}

			if(req.online){
				req.body.status_pending = false;
			}else{
				req.body.status_pending = true;
			}

	      	/* save current booking */
			CustomerTicket.create(req.body, function(err, ct) {
			    
			    if(err) { 

			    	return res.status(200).json({ result: "failed", message: "Server Error", log: err});
			   	
			   	}else{

			   		Typeofservice.findOne({name : type_of_service},function(err_5, service){

			   			return res.status(200).json({ 

			   				result : "success",
			   				customer : customer, 
			   				type_of_service : type_of_service,
			   				gallery : gallery,
			   				promo : gal.promo,
			   				picture: "http://" + hostname + "/media/customer/" + uuid + ".jpg",
			   				queueing_count : queueing_count,
			   				queueing_number : String(queueing_number) + service.tag, 
			   				estimate_waiting_time : estimate_waiting_time
			   			
			   			});

			   		});


					CustomerTicket.find({
						gallery : gallery, 
						status : 'waiting', 
						date: {
						      $gte: date,
						      $lt: moment(date).add(1, 'days')
						    }
					},function(err, customer_tickets){

			   			asyncLoop2( 0, customer_tickets ,'waiting', function() {

			   				Socket.emit("tvdisplay:waiting_list:"+gal._id, data_waiting_list); 

			   			});	
			   			

					});	

					Typeofservice.find({},function(err, data){

						asyncLoop( 0, data , function() {
				      
					        Socket.emit("agent:waiting_list:"+gal._id, data_waiting);

					    });

					});

			   	}
			
			});



		});


	});
	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;

        if( i < num_rows ) {
          
        	CustomerTicket.count({type_of_service: data[i].name, status: 'waiting'},function(err,count){

        		data_waiting.push({

        			name: data[i].name,
        			count: count

        		});

        		asyncLoop( i+1, data, callback );

        	});
      
      	} else {

          callback();
      
      	}
  	}
  	function asyncLoop2( i, customer_tickets, status,  callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
            if(status=="process"){	
              data_counter_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter
              });  

              Gallery.findOne({name : customer_tickets[i].gallery},function(err, gallery){

              	Socket.emit("agent:current_customer:"+gallery._id+":"+customer_tickets[i].counter, 
	              { 
	              	id : customer_tickets[i]._id, 
	              	customer : customer_tickets[i].customer, 
	              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
	              	counter: customer_tickets[i].counter
	              }
              	); 

              });
              

            }else{
              data_waiting_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              });  
           	} 	
            
            asyncLoop2( i+1, customer_tickets, status, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}
}

exports.agent_current_customer = function(req, res){

	var gallery = req.body.gallery;
	var counter = req.body.counter;
	var date = req.body.date;
	var status = 'process';

	CustomerTicket.findOne({ 
		gallery : gallery, 
		counter: counter, 
		date: {
			      $gte: date,
			      $lt: moment(date).add(1, 'days')
			    }, 
		status: status 
	}, function(err, data){

		if(err){
			return res.status(200).json({ result: "failed", message: "Server Error", log: err});
		}

		if(data){
			/* find service tag */
			Typeofservice.findOne({name : data.type_of_service},function(err, service){
      
            	return res.status(200).json({ 
		              	id : data._id, 
		              	customer : data.customer, 
		              	queueing_number : String(data.queueing_number) + service.tag,
		              	counter: data.counter
		              });
	            
	        });     
			
		}

	});	

}

exports.agent_repeat_customer = function(req, res){

	var id = req.body.customer_ticket_id;

	CustomerTicket.findById(id, function(err, data){
		if(data){
			Typeofservice.findOne({name : data.type_of_service},function(err, service){
			    Gallery.findOne({name : data.gallery},function(err, gallery){
					/* recall current customer on socket channel agent:recall_customer */
			      	Socket.emit("agent:recall_customer:"+gallery._id, 
			          { 
			          	id : data._id, 
			          	customer : data.customer, 
			          	queueing_number : String(data.queueing_number) + service.tag,
			          	counter: data.counter
			          }
			      	); 
			      	
		      	});
			});

			res.status(200).send("ok");

		}else{

			res.status(200).json({ result: "failed", message: "No waiting customer found!"});

		}
		
	});		

}

exports.agent_recall_customer = function(req, res){

	var id = req.body.customer_ticket_id;
	var data_counter_list = [];
	var data_waiting_list = [];

	CustomerTicket.findById(id, function(err, data){
		
		if(data){

			if(data.is_skipped==true){

				data.status = "skipped";

			}else{

				data.status = "done";

			}
			
			data.save(function(){


				CustomerTicket.findOne({ status: "skipped" }).sort('skipped_number').exec(function(err, customer_ticket){

					if(customer_ticket){

						customer_ticket.status = "process";

						customer_ticket.save(function(){

							/* find service tag */
							Typeofservice.findOne({name : customer_ticket.type_of_service},function(err, service){
			          
								/* find gallery id for socket channel */
					            Gallery.findOne({name : customer_ticket.gallery},function(err, gallery){

					            	/* send data to update current customer on socket channel agent:current_customer */
					              	Socket.emit("agent:current_customer:"+gallery._id+":"+customer_ticket.counter, 
						              { 
						              	id : customer_ticket._id, 
						              	customer : customer_ticket.customer, 
						              	queueing_number : String(customer_ticket.queueing_number) + service.tag,
						              	counter: customer_ticket.counter
						              }
					              	); 

					              	/* update tv display data */

							        CustomerTicket.find({gallery : customer_ticket.gallery, status : 'process', date: customer_ticket.date},function(err, customer_tickets){

							   			asyncLoop2( 0, customer_tickets ,'process', function() {

							   				Socket.emit("tvdisplay:counter_list:"+gallery._id, data_counter_list); 

							   			});	
							   			

									});	

									CustomerTicket.find({gallery : customer_ticket.gallery, status : 'waiting', date: customer_ticket.date},function(err, customer_tickets){

							   			asyncLoop2( 0, customer_tickets ,'waiting', function() {

							   				Socket.emit("tvdisplay:waiting_list:"+gallery._id, data_waiting_list); 

							   			});	
							   			

									});	

					            });

					        });

						});

						res.status(200).send("ok");

					}else{

						res.status(200).json({ result: "failed", message: "No skipped customer found!"});
					}
					

				});	


			});
		}else{

			res.status(200).json({ result: "failed", message: "No skipped customer found!"});
		
		}

	});		
	function asyncLoop2( i, customer_tickets, status,  callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
            if(status=="process"){	

              data_counter_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter
              });  

            }else{

              data_waiting_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              });  

           	} 	
            
            asyncLoop2( i+1, customer_tickets, status, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}
}

exports.agent_next_customer = function(req, res){

	var id = req.body.customer_ticket_id;
	var data_counter_list = [];
	var data_waiting_list = [];

	/* find current customer ticket */
	CustomerTicket.findById(id, function(err, data){

		if(data){
			/* set current customer ticket status to be 'done' */
			data.status = 'done';
			data.save(function(err, cst){

				/* find next customer ticket from waiting list order by queueing number */
				CustomerTicket.findOne({ status: "waiting" }).sort('queueing_number').exec(function(err, customer_ticket){

					if(customer_ticket){

						/* update next customer status to be process */
						customer_ticket.status = 'process';
						customer_ticket.counter = data.counter;

						customer_ticket.save(function(err){

							/* find service tag */
							Typeofservice.findOne({name : customer_ticket.type_of_service},function(err, service){
		              
								/* find gallery id for socket channel */
					            Gallery.findOne({name : customer_ticket.gallery},function(err, gallery){

					            	/* send data to update current customer on socket channel agent:current_customer */
					              	Socket.emit("agent:current_customer:"+gallery._id+":"+customer_ticket.counter, 
						              { 
						              	id : customer_ticket._id, 
						              	customer : customer_ticket.customer, 
						              	queueing_number : String(customer_ticket.queueing_number) + service.tag,
						              	counter: customer_ticket.counter
						              }
					              	); 

					              	/* update tv display data */

							        CustomerTicket.find({gallery : customer_ticket.gallery, status : 'process', date: customer_ticket.date},function(err, customer_tickets){

							   			asyncLoop2( 0, customer_tickets ,'process', function() {

							   				Socket.emit("tvdisplay:counter_list:"+gallery._id, data_counter_list); 

							   			});	
							   			

									});	

									CustomerTicket.find({gallery : customer_ticket.gallery, status : 'waiting', date: customer_ticket.date},function(err, customer_tickets){

							   			asyncLoop2( 0, customer_tickets ,'waiting', function() {

							   				Socket.emit("tvdisplay:waiting_list:"+gallery._id, data_waiting_list); 

							   			});	
							   			

									});	

					            });

					        });

						});
						
						res.status(200).send("ok");
							
					}else{

						res.status(200).json({ result: "failed", message: "No waiting customer found!"});

					}

				});

			});

		}else{

			res.status(200).json({ result: "failed", message: "No waiting customer found!"});
		
		}
		
	});
	function asyncLoop2( i, customer_tickets, status,  callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
            if(status=="process"){	

              data_counter_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter
              });  

            }else{

              data_waiting_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              });  

           	} 	
            
            asyncLoop2( i+1, customer_tickets, status, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}

}
exports.agent_noshow_customer = function(req, res){

	var id = req.body.customer_ticket_id;
	var data_counter_list = [];
	var data_waiting_list = [];

	CustomerTicket.find({status:'skipped'},function(err, skipped_tickets){

		/* find current customer ticket */
		CustomerTicket.findById(id, function(err, data){

			if(data){
				/* set current customer ticket status to be 'done' */
				if(data.is_skipped==true){

					data.status = 'skipped';
					data.skipped_number = skipped_tickets.length + 1;

					if(skipped_tickets.length > 0){

						for(var i=0; i < skipped_tickets.length; i++){

							skipped_tickets[i].skipped_number = skipped_tickets[i].skipped_number -1;

						}

					}

				}else{

					data.status = 'skipped';
					data.is_skipped = true;
					data.skipped_number = skipped_tickets.length + 1;

				}
				

				data.save(function(err, cst){

					/* find next customer ticket from waiting list order by queueing number */
					CustomerTicket.findOne({ status: "waiting" }).sort('queueing_number').exec(function(err, customer_ticket){

						if(customer_ticket){

							/* update next customer status to be process */
							customer_ticket.status = 'process';
							customer_ticket.counter = data.counter;

							customer_ticket.save(function(err){

								/* find service tag */
								Typeofservice.findOne({name : customer_ticket.type_of_service},function(err, service){
			              
									/* find gallery id for socket channel */
						            Gallery.findOne({name : customer_ticket.gallery},function(err, gallery){

						            	/* send data to update current customer on socket channel agent:current_customer */
						              	Socket.emit("agent:current_customer:"+gallery._id+":"+customer_ticket.counter, 
							              { 
							              	id : customer_ticket._id, 
							              	customer : customer_ticket.customer, 
							              	queueing_number : String(customer_ticket.queueing_number) + service.tag,
							              	counter: customer_ticket.counter
							              }
						              	); 

						              	/* update tv display data */
								        CustomerTicket.find({gallery : customer_ticket.gallery, status : 'process', date: customer_ticket.date},function(err, customer_tickets){

								   			asyncLoop2( 0, customer_tickets ,'process', function() {

								   				Socket.emit("tvdisplay:counter_list:"+gallery._id, data_counter_list); 

								   			});	
								   			

										});	

										CustomerTicket.find({gallery : customer_ticket.gallery, status : 'waiting', date: customer_ticket.date},function(err, customer_tickets){

								   			asyncLoop2( 0, customer_tickets ,'waiting', function() {

								   				Socket.emit("tvdisplay:waiting_list:"+gallery._id, data_waiting_list); 

								   			});	
								   			

										});	

						            });

						        });

							});
							
							res.status(200).send("ok");
								
						}else{

							res.status(200).json({ result: "failed", message: "No waiting customer found!"});

						}

					});

				});

			}else{

				res.status(200).json({ result: "failed", message: "No waiting customer found!"});

			}
			
		});

	});
	
	function asyncLoop2( i, customer_tickets, status,  callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
            if(status=="process"){	

              data_counter_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter
              });  

            }else{

              data_waiting_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              });  

           	} 	
            
            asyncLoop2( i+1, customer_tickets, status, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}

}
exports.gallery_mdn_reg = function(req, res){

	var customer = req.body.name;
	var gallery = req.body.gallery;
	var type_of_service = req.body.type_of_service;
	var ticket_type = "regular";
	var date = moment().format('YYYY-MM-DD');
	var time = moment().format('HH:mm');

	CustomerTicket.findOne({gallery : gallery, status : 'waiting', type_of_service : type_of_service, date : date}).sort('-queueing_number').exec(function(err_1, last_qn){

		/* create incremental queueing_number */

		var queueing_number = 1;

		if(last_qn){

			queueing_number = last_qn.queueing_number + 1;
		
		}

		req.body.queueing_number = queueing_number;

		Gallery.findOne({name : gallery},function(err_3, gal){

			/* create estimate waiting time from service sla config per gallery */

			if(gal.length > 0){
				var service = gal.type_of_service.filter(function(a){ return a.name == type_of_service})[0];
			}else{
				var service = { sla : 5 };
			}
			
			var queueing_count = 1;
			if(last_qn){
				queueing_count = last_qn.queueing_number + 1;
			}
			var estimate_waiting_time = (parseInt(queueing_count)-1) * parseInt(service.sla);

			req.body.ticket_type = ticket_type;
			req.body.date = date;
			req.body.time = time;
			req.body.customer = customer;
			req.body.status = 'waiting';

			/* save current booking */
			CustomerTicket.create(req.body, function(err_4, ticket) {
			    
			    if(err_4) { 
			    	return res.status(200).json({ result: "failed", message: "Server Error", log: err_4});
			   	}else{

			   		Typeofservice.findOne({name : type_of_service},function(err_5, service){

			   			return res.status(200).json({ 

			   				result : "success",
			   				customer : customer, 
			   				type_of_service : type_of_service,
			   				gallery : gallery,
			   				promo : gal.promo,
			   				queueing_count : queueing_count,
			   				queueing_number : String(queueing_number) + service.tag, 
			   				estimate_waiting_time : estimate_waiting_time
			   			
			   			});

			   		});
			   	}
			
			});
			

		});


	});

}

exports.kiosk_reg_via_bookcode = function(req, res){

	var book_code = req.body.book_code;
	var date = moment().format('YYYY-MM-DD');
	var customer_status = "waiting";
	var data_waiting_list = [];
	var data_waiting = [];

	CustomerTicket.findOne({book_code:book_code}, function (err, customer_ticket) {

		if(!customer_ticket){

			return res.status(200).json({ result: 'failed', message: 'Data not found.'});

		}else{

			if(moment(customer_ticket.date).format("YYYY-MM-DD") == date){

				Gallery.findOne({name : customer_ticket.gallery},function(err_2, gal){

					/* create estimate waiting time from service sla config per gallery */

					if(gal){
						var service = gal.type_of_service.filter(function(a){ return a.name == customer_ticket.type_of_service})[0];
					}else{
						var service = { sla : 5 };
					}
					
					var queueing_count = 1;
					if(customer_ticket){
						queueing_count = customer_ticket.queueing_number + 1;
					}
					var estimate_waiting_time = (parseInt(queueing_count)-1) * parseInt(service.sla);

					Typeofservice.findOne({name : customer_ticket.type_of_service},function(err_3, service){

      					customer_ticket.status = customer_status;

			          	/* save current booking */
						customer_ticket.save(function(ct) {
						   

					   		Typeofservice.findOne({name : customer_ticket.type_of_service},function(err_5, service){

					   			Customer.findOne({ username:customer_ticket.customer },function(customer){
					   				
					   				var hostname = req.headers.host;
					   				var picture = null;

					   				if(customer){
					   					if(customer.picture){
					   						picture = "http://" + hostname + "/media/customer/" + customer.picture;
					   					}
					   					
					   				}

					   				return res.status(200).json({ 

						   				result : "success",
						   				customer : customer_ticket.customer, 
						   				type_of_service : customer_ticket.type_of_service,
						   				gallery : customer_ticket.gallery,
						   				picture: picture,
						   				promo : gal.promo,
						   				queueing_count : queueing_count,
						   				queueing_number : String(customer_ticket.queueing_number) + service.tag, 
						   				estimate_waiting_time : estimate_waiting_time
						   			
						   			});

					   			});

					   		});


							CustomerTicket.find({
								gallery : customer_ticket.gallery, 
								status : 'waiting', 
								date: {
								      $gte: date,
								      $lt: moment(date).add(1, 'days')
								    }
							},function(err, customer_tickets){

					   			asyncLoop2( 0, customer_tickets ,'waiting', customer_ticket.gallery, function() {

					   				Socket.emit("tvdisplay:waiting_list:"+gal._id, data_waiting_list); 

					   			});	
					   			

							});	

							Typeofservice.find({},function(err, data){

								asyncLoop( 0, data , function() {
						      
							        Socket.emit("agent:waiting_list:"+gal._id, data_waiting);

							    });

							});
						
						});


					});

				});

			}else{

				return res.status(200).json({ result: 'failed', message: 'Booking date mismatch. Could not proceed today.'});

			}

		}

		

	});
	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;

        if( i < num_rows ) {
          
        	CustomerTicket.count({type_of_service: data[i].name, status: 'waiting'},function(err,count){

        		data_waiting.push({

        			name: data[i].name,
        			count: count

        		});

        		asyncLoop( i+1, data, callback );

        	});
      
      	} else {

          callback();
      
      	}
  	}
  	function asyncLoop2( i, customer_tickets, status, gallery,  callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
            if(status=="process"){	
              data_counter_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter
              });  

              Gallery.findOne({name : customer_tickets[i].gallery},function(err, gallery){

              	Socket.emit("agent:current_customer:"+gallery._id+":"+customer_tickets[i].counter, 
	              { 
	              	id : customer_tickets[i]._id, 
	              	customer : customer_tickets[i].customer, 
	              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
	              	counter: customer_tickets[i].counter
	              }
              	); 

              });
              

            }else{
              data_waiting_list.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              });  
           	} 	
            
            asyncLoop2( i+1, customer_tickets, status, gallery, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}

}

exports.counter_list = function(req, res){

	var gallery = req.body.gallery;
	var date = moment().format('YYYY-MM-DD');
	var data = [];

	CustomerTicket.find({
		gallery: gallery, 
		date: {
			      $gte: date,
			      $lt: moment(date).add(1, 'days')
			    }, 
		status : 'process' 
	}, function (err, customer_tickets) {

		if(customer_tickets.length > 0){

			asyncLoop( 0, customer_tickets , function() {
      
	          return res.status(200).json({ result : "success", message: "success pull data!", data : data });

	        });

		}else{

			return res.status(200).json({ result : "failed", message : "No data available." });

		}

	});		
	
	function asyncLoop( i, customer_tickets, callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
             
              data.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag,
              	counter: customer_tickets[i].counter 
              });  

              asyncLoop( i+1, customer_tickets, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}
}

exports.queue_list = function(req, res){

	var gallery = req.body.gallery;
	var date = moment().format('YYYY-MM-DD');
	var data = [];

	CustomerTicket.find({
		gallery: gallery, 
		date: {
			      $gte: date,
			      $lt: moment(date).add(1, 'days')
			    },  
		status : 'waiting' 
	}, function (err, customer_tickets) {

		if(customer_tickets.length > 0){

			asyncLoop( 0, customer_tickets , function() {
      
	          return res.status(200).json({ result : "success", message: "success pull data!", data : data });

	        });

		}else{

			return res.status(200).json({ result : "failed", message : "No data available." });

		}

	});		
	
	function asyncLoop( i, customer_tickets, callback ) {

        var num_rows = customer_tickets.length;

        if( i < num_rows ) {
          
        
          Typeofservice.findOne({name : customer_tickets[i].type_of_service},function(err, service){
              
             
              data.push({ 
              	id : customer_tickets[i]._id, 
              	customer : customer_tickets[i].customer, 
              	queueing_number : String(customer_tickets[i].queueing_number) + service.tag
              });  

              asyncLoop( i+1, customer_tickets, callback );

          });
      
      	} else {

          callback();
      
      	}
  	}

}

exports.book_canceling = function(req, res) {
	Gallery.findOne({name:req.body.gallery},function(err,gallery){
		//if(err) return res.status(500).json(err);
		if(err) return sendError(res, 500, err);

		//if(!gallery) return res.status(404).send('Gallery is not found');
		if(!gallery) return sendError(res, 404, 'Gallery is not found');

		if(gallery.ipAddress){
		    httpClient.request({
		        host: gallery.ipAddress,
		        port: gallery.port || 9000,
		        path: '/api/cst_tickets/book_canceling',
		        method: 'post',
		        headers: {'Content-Type': 'application/JSON'}
		    }, function(status,data){
/*
                       if (status === 200) {

                         CustomerTicket.findOneAndUpdate({
                           book_code: req.body.book_code },
                           { $set: { status: 'cancelled' }},
                           
                           function (errticket, olddoc) {
                             if (errticket) {
                               console.log('cancelling failed:', errticket.message);
                               return;
                             }  
                             console.log('cancelling success');
                         });
                       }
*/

                       return httpCallback(res, status, data);
		    }, req.body);
		}else{
                    //res.status(500).send('Service for this gallery is not available for now');
                    sendError(res, 500,
                        'Service for this gallery is not available for now');
		}
	})
}
exports.postpone = function(req, res) {
	Gallery.findOne({name:req.body.gallery},function(err,gallery){
		//if(err) return res.status(500).send(err);
		if(err) return sendError(res, 500, err);

		//if(!gallery) return res.status(404).send('Gallery is not found');
                if(!gallery)
                    return sendError(res, 404, 'Gallery is not found');

		if(gallery.ipAddress){
			httpClient.request({
		        host: gallery.ipAddress,
		        port: gallery.port || 9000,
		        path: '/api/cst_tickets/postpone',
		        method: 'post',
		        headers: {'Content-Type': 'application/JSON'}
		    }, function(status,data){
/*
                       if (status === 200) {
                         CustomerTicket.findOneAndUpdate({
                           book_code: req.body.book_code },
                           { $set: {
                             date: req.body.date,
                             time: req.body.time
                           }}, function (errticket, olddoc) {
                             if (errticket) {
                               console.log('postpone failed:', errticket.message);
                               return;
                             }  
                             console.log('postpone success');
                         });
                       }
*/
                       return httpCallback(res, status, data);
		    },req.body);
		}else{
                    //res.status(500).send('Service for this gallery is not available for now');

                    sendError(res, 500,
                        'Service for this gallery is not available for now');
                }
	})
}

exports.agent_waiting_list = function(req, res){

	var data_waiting = [];

	Typeofservice.find({},function(err, data){

		asyncLoop( 0, data , function() {
      
	          return res.status(200).json({ result : "success", message: "success pull data!", data : data_waiting });

	    });

	});

	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;

        if( i < num_rows ) {
          
        	CustomerTicket.count({type_of_service: data[i].name, status: 'waiting'},function(err,count){

        		data_waiting.push({

        			name: data[i].name,
        			count: count

        		});

        		asyncLoop( i+1, data, callback );

        	});
      
      	} else {

          callback();
      
      	}
  	}
}

exports.queueing_chart = function(req, res){

	var dates = req.body.dates;
	var data_done = [];
	var data_unserviced = [];
	var data_total = [];

	

	asyncLoop( 0, dates ,  function() {
  
      return res.status(200).json({ 
      	result : "success", 
      	message: "success pull data!", 
      	series_done_transaction : data_done, 
      	series_unserviced_transaction : data_unserviced, 
      	series_total_transaction : data_total, 
      });

    });


	function asyncLoop( i, dates, callback ) {


		if(dates){

			var num_rows = dates.length;

	        if( i < num_rows ) {
	          
	        	CustomerTicket.count({
			      status: 'done',		
				  date: {
				      $gte: dates[i],
				      $lt: moment(dates[i]).add(1, 'days')
				    }
			    },function(err, count){

			    	data_done.push(count);

			    	CustomerTicket.count({
				      status: 'unserviced',		
					  date: {
					      $gte: dates[i],
					      $lt: moment(dates[i]).add(1, 'days')
					    }
				    },function(err, count){

				    	data_unserviced.push(count);

				    	CustomerTicket.count({
						  date: {
						      $gte: dates[i],
						      $lt: moment(dates[i]).add(1, 'days')
						    }
					    },function(err, count){

					    	data_total.push(count);

					    	asyncLoop( i+1, dates, callback );
						});

					});
				});
	      		

	      	} else {

	          callback();
	      
	      	}
		}else{

			callback();
		
		}
        
  	}
}
exports.customer_chart = function(req, res){

	var dates = req.body.dates;
	var data_customer_mobile = [];
	var data_customer_regular = [];
	var data_total = [];

	

	asyncLoop( 0, dates ,  function() {
  
      return res.status(200).json({ 
      	result : "success", 
      	message: "success pull data!", 
      	series_mobile_customer : data_customer_mobile, 
      	series_regular_customer : data_customer_regular, 
      	series_total_transaction : data_total
      });

    });


	function asyncLoop( i, dates, callback ) {

        var num_rows = dates.length;

        if( i < num_rows ) {
          
        	CustomerTicket.count({
		      ticket_type: 'mobile',		
			  date: {
			      $gte: dates[i],
			      $lt: moment(dates[i]).add(1, 'days')
			    }
		    },function(err, count){

		    	data_customer_mobile.push(count);

		    	CustomerTicket.count({
			      ticket_type: 'regular',	
				  date: {
				      $gte: dates[i],
				      $lt: moment(dates[i]).add(1, 'days')
				    }
			    },function(err, count){

			    	data_customer_regular.push(count);

			    	CustomerTicket.count({
					  date: {
					      $gte: dates[i],
					      $lt: moment(dates[i]).add(1, 'days')
					    }
				    },function(err, count){

				    	data_total.push(count);

				    	asyncLoop( i+1, dates, callback );
					});

				});
			});
      		

      	} else {

          callback();
      
      	}
  	}
}
exports.rpt_productivity_national = function(req, res){

	var data_productivity = [];
	var order = req.params.order;
	var limit = req.params.limit || 10;
	var page = req.params.page || 1;
	var offset = (page-1) * limit;
	var filter = req.params.filter || null;
	var aggregate_config = [

		{
            $group: {
                _id: { date:  "$date" , agent: "$agent" },
                gallery: { $first: "$gallery" }
            }
        },
        { "$limit": parseInt(offset) + parseInt(limit) },
    	{ "$skip": parseInt(offset) }

	];

	if(order == 'date'){
		
		aggregate_config.push({ $sort : { "_id.date" : 1 } });

	}else if(order == '-date'){

		aggregate_config.push({ $sort : { "_id.date" : -1 } });

	}else if(order == 'agent'){	

		aggregate_config.push({ $sort : { "_id.agent" : 1 } });

	}else if(order == '-agent'){	

		aggregate_config.push({ $sort : { "_id.agent" : -1 } });

	}else if(order == 'gallery'){	

		aggregate_config.push({ $sort : { "gallery" : 1 } });

	}else if(order == '-gallery'){	

		aggregate_config.push({ $sort : { "gallery" : -1 } });	

	}

	if(filter != null){

		if(filter != '-'){
			aggregate_config.push({ $match : { "_id.agent" : filter } });	
		}

	}

	CustomerTaggingTransaction.aggregate(aggregate_config, function (err, data) {
        
		if(data){
			asyncLoop( 0, data ,  function() {
  
		   		res.status(200).json([{ count:data_productivity.length , data_productivity : data_productivity }]);

		    });
		}else{

			res.status(200).json([{ count:data_productivity.length , data_productivity : data_productivity }]);
		
		}
        

        
    });

	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;

        if( i < num_rows ) {
          
        	var transaction_date = data[i]._id.date;
        	var agent = data[i]._id.agent;
        	var gallery = data[i].gallery;

        	User.findOne({name : agent, role: 'CSR'},function(err, user){
        		
        		if(user){
        			var nik = user.nik;
        		}else{
        			var nik = '-';
        		}
        		
        		Gallery.findOne({name: gallery},function(err, gal){

        			if(gal){
        				var region = gal.city;
        			}else{
        				var region = '-';
        			}

	        		CustomerTaggingTransaction.aggregate([
		        		{
				            $match: {
				                gallery: gallery,
				                agent: agent,
				                date: transaction_date
				            }
				        },
				        {
				            $group: {
				                _id: "$customer"
				            }
				        }
				    ], function (err, tag_transaction) {
				        
				    	
				    	var total_handled = tag_transaction.length;

				    	CustomerTaggingTransaction.find({
				                gallery: gallery,
				                agent: agent,
				                date: {
							      $gte: transaction_date,
							      $lt: moment(transaction_date).add(1, 'days')
							    }
				        },function(err, transactions){

				        	var minute = 0;
				        	var second = 0;
				        	var total_minute = 0;
				        	var total_hour = 0;
				        	var final_total_hour = 0;
				        	var final_total_minute = 0;
				        	var final_total_second = 0;

				        	if(transactions.length > 0){

				        		for(var j = 0;j < transactions.length; j++){
				        			
				        			if(transactions[j].duration){

				        				var explode_time = transactions[j].duration.split(":");

					        			minute = minute + parseInt(explode_time[0]);
					        			second = second + parseInt(explode_time[1]);

				        			}
				        			

				        		}

				        	}

				        	if(second >= 60){

				        		total_minute = second / 60;

				        		final_total_second = second % 60;

				        	}else{

				        		total_minute = 0;

				        		final_total_second = second;

				        	}

				        	if((minute + Math.ceil(total_minute)) >= 60){

				        		final_total_hour = (minute + Math.ceil(total_minute)) / 60;

				        		final_total_minute = (minute + Math.ceil(total_minute)) % 60;

				        	}else{

				        		final_total_minute = minute;

				        	}

				        	data_productivity.push({

				        		date : moment(transaction_date).format("DD-MM-YYYY"),
				        		nik : nik,
				        		agent : agent,
				        		gallery : gallery,
				        		region : region,
				        		total_handled : total_handled,
				        		total_time : final_total_hour + ':' + final_total_minute + ':' + final_total_second
				        			
				        	});

				        	asyncLoop( i+1, data, callback );

				    	});
				        
				    });
	        	});
        	});    	

      	} else {

          callback();
      
      	}
  	}
}
exports.rpt_productivity_gallery = function(req, res){

	var data_productivity_gallery = [];
	var limit = req.params.limit || 10;
	var page = req.params.page || 1;
	var order = req.params.order || 'date';
	var offset = (page-1) * limit;

	CustomerTicket.find({status:"done"},function(err, data){

		asyncLoop( 0, data ,  function() {
  	
			res.status(200).json([{ count:data_productivity_gallery.length , data_productivity : data_productivity_gallery }]);

		});

	})
    .sort(order)
    .skip(offset)
    .limit(limit);

	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;

        if( i < num_rows ) {
          	
          	User.findOne({role: "CSR", "role_item.0.value" : data[i].gallery, "role_item.1.value" : data[i].counter },function(err, user){

          		if(user){
          			var nik = user.nik;
          			var agent = user.name;
          		}else{
          			var nik = '-';
          			var agent = '-';
          		}
          		Gallery.findOne({name : data[i].gallery},function(err, gal){


          			Typeofservice.findOne({name : data[i].type_of_service},function(err, service){

          				data_productivity_gallery.push({

	          				date: moment(data[i].date).format("DD-MM-YYYY"),
	          				nik: nik,
	          				agent: agent,
	          				gallery: gal.name,
	          				region: gal.city,
	          				type_of_service: data[i].type_of_service,
	          				queueing_number: String(data[i].queueing_number) + service.tag

	          			});

	          			asyncLoop( i+1, data, callback );

          			});
          			

          		});	

          	});

      	} else {

          callback();
      
      	}
  	}

}
exports.rpt_queueing_transaction = function(req, res){

	var data_queueing_status = [];
	var limit = req.params.limit || 10;
	var page = req.params.page || 1;
	var order = req.params.order || 'date';
	var offset = (page-1) * limit;
	var aggregate_config = [

		{
            $group: {
                _id: { date:  "$date" , gallery: "$gallery" }
            }
        },
        { "$limit": parseInt(offset) + parseInt(limit) },
    	{ "$skip": parseInt(offset) }

	];

	if(order == 'date'){
		
		aggregate_config.push({ $sort : { "_id.date" : 1 } });

	}else if(order == '-date'){

		aggregate_config.push({ $sort : { "_id.date" : -1 } });

	}else if(order == 'gallery'){	

		aggregate_config.push({ $sort : { "_id.gallery" : 1 } });

	}else if(order == '-gallery'){	

		aggregate_config.push({ $sort : { "_id.gallery" : -1 } });	

	}

	CustomerTicket.aggregate(aggregate_config, function (err, data) {
        
		if(data){
			asyncLoop( 0, data ,  function() {
  
		   		res.status(200).json([{ count:data_queueing_status.length , data_queueing_status : data_queueing_status }]);

		    });
		}else{

			res.status(200).json([{ count:data_queueing_status.length , data_queueing_status : data_queueing_status }]);
		
		}
        

        
    });
	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;

        if( i < num_rows ) {
          	
          	CustomerTicket.count({
          		status : 'done', 
          		gallery: data[i]._id.gallery, 
          		date: {
					      $gte: data[i]._id.date,
					      $lt: moment(data[i]._id.date).add(1, 'days')
					  } 
			},function(err, total_done){

				CustomerTicket.count({
	          		status : 'unserviced', 
	          		gallery: data[i]._id.gallery, 
	          		date: {
					      $gte: data[i]._id.date,
					      $lt: moment(data[i]._id.date).add(1, 'days')
					  } 
				},function(err, total_unserviced){

					Gallery.findOne({name : data[i]._id.gallery},function(err, gal){

						data_queueing_status.push({

							date: moment(data[i]._id.date).format("DD-MM-YYYY"),
							gallery: gal.name,
							region: gal.city,
							serviced: total_done,
							unserviced: total_unserviced

						});

						asyncLoop( i+1, data, callback );

					});
					
					
	          	});


          	});

      	} else {

          callback();
      
      	}
  	}
}
exports.rpt_type_of_service_transaction = function(req, res){

	var data_type_of_service_transaction = [];
	var tos = [];
	var limit = req.params.limit || 10;
	var page = req.params.page || 1;
	var order = req.params.order || 'date';
	var offset = (page-1) * limit;
	var aggregate_config = [

		{
            $group: {
                _id: { date:  "$date" }
            }
        },
        { "$limit": parseInt(offset) + parseInt(limit) },
    	{ "$skip": parseInt(offset) }

	];

	if(order == 'date'){
		
		aggregate_config.push({ $sort : { "_id.date" : 1 } });

	}else if(order == '-date'){

		aggregate_config.push({ $sort : { "_id.date" : -1 } });

	}

	CustomerTicket.aggregate(aggregate_config, function (err, data) {
        
		if(data){
			asyncLoop( 0, data ,  function() {
  
		   		res.status(200).json([{ count:data_type_of_service_transaction.length , data_type_of_service_transaction : data_type_of_service_transaction }]);

		    });
		}else{

			res.status(200).json([{ count:data_type_of_service_transaction.length , data_type_of_service_transaction : data_type_of_service_transaction }]);
		
		}
        

        
    });
	function asyncLoop( i, data, callback ) {

        var num_rows = data.length;
        if( i < num_rows ) {

          	Typeofservice.find({},function(err, services){

       
          		asyncLoop2( 0, data[i] ,  services ,  function() {

          			data_type_of_service_transaction.push({
	          			date : moment(data[i]._id.date).format("DD-MM-YYYY"),
	          			tos : tos
	          		});

          			tos = [];

	          		asyncLoop( i+1, data, callback );

          		});	
          		

          	});

      	} else {

          callback();
      
      	}
  	}
  	function asyncLoop2( j, data, services,  callback ) {

  		var num_rows = services.length;
        if( j < num_rows ) {
          	
          	CustomerTicket.count({
  				date: {
			      $gte: data._id.date,
			      $lt: moment(data._id.date).add(1, 'days')
			    },
			    type_of_service: services[j].name 
  			},function(err, count){

  				tos.push({
  					name: services[j].name,
  					total: count
  				});

  				asyncLoop2( j+1, data, services,  callback );

  			});

      	} else {

          callback();
      
      	}
  	}	
}	
exports.rpt_transaction_exceeding_sla = function(req, res){

	var data_transaction_exceeding_sla = [];
	var limit = req.params.limit || 10;
	var page = req.params.page || 1;
	var order = req.params.order || 'date';
	var offset = (page-1) * limit;

	CustomerTaggingTransaction.find({exceeding_sla:true},function(err, data){

		asyncLoop( 0, data ,  function() {
  
			res.status(200).json([{ count:data_transaction_exceeding_sla.length , data_transaction_exceeding_sla : data_transaction_exceeding_sla }]);

		});

	}) 
	.sort(order)
    .skip(offset)
    .limit(limit);

	function asyncLoop( i, data , callback ) {

        var num_rows = data.length;
        if( i < num_rows ) {

          	TaggingTransaction.findOne({tagging_code : data[i].tagging_code},function(err, tagging_transaction){

          		if(tagging_transaction){

          			var sla = tagging_transaction.sla;
	          		var exceeding_sla = false;
	          		var explode_time = data[i].duration.split(":");
	          		var minute = explode_time[0];
	          		var second = explode_time[1];

	          		if(parseInt(minute) > parseInt(sla)){

	          			exceeding_sla = true;

	          		}else if(parseInt(minute) == parseInt(sla)){

	          			if(parseInt(second) > 0){

	          				exceeding_sla = true;

	          			}

	          		}

	          		if(exceeding_sla){

	          			User.findOne({name: data[i].agent, role: "CSR" },function(err, user){

	          				if(user){
	          					var nik = user.nik;
	          					var agent = user.name;
	          				}else{
	          					var nik = '-';
	          					var agent = '-';
	          				}

	          				Gallery.findOne({name: data[i].gallery},function(err, gal){

	          					var region = gal.city;

	          					data_transaction_exceeding_sla.push({

			          				date : moment(data[i].date).format("DD-MM-YYYY"),
			          				nik: nik,
			          				agent: agent,
			          				gallery: data[i].gallery,
			          				region: region,
			          				tagging_code: data[i].tagging_code,
			          				sla: sla,
			          				duration: data[i].duration

			          			});

	          					asyncLoop( i+1, data, callback );

	          				});

	          			});
	          			
	          				
	          		}else{
	          			asyncLoop( i+1, data, callback );
	          		}

          		}else{

          			asyncLoop( i+1, data, callback );
          		
          		}

          	});

      	} else {

          callback();
      
      	}
  	}
}
