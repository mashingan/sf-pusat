/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /CustomerTaggingTransactions              ->  index
 * POST    /CustomerTaggingTransactions              ->  create
 * GET     /CustomerTaggingTransactions/:id          ->  show
 * PUT     /CustomerTaggingTransactions/:id          ->  update
 * DELETE  /CustomerTaggingTransactions/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var moment = require('moment');
var CustomerTaggingTransaction = require('./customer_tagging_transaction.model');

// Added to implement SMS notification
var Customer = require('../customer/customer.model');

var Gallery = require('../gallery/gallery.model');
var Typeofservice = require('../type_of_service/typeofservice.model');
var CustomerTicket = require('../cst_ticket/cst_ticket.model');
var TaggingTransaction = require('../tagging_transaction/tagging_transaction.model');
var Socket = null;
var SendSMS = require('../../components/smsGateway');


exports.socketHandler = function (socket,socketio) {

    Socket = socketio; // attaching Socket to variable
};


//Sync
exports.localSync = function(req,res){
  var _idarr = Array.isArray(req.body) ?
    req.body.map(function (d) { return d._id; }) : [req.body._id];

  CustomerTaggingTransaction.remove({_id: { $in: _idarr }}, function (err) {
    if (err) return res.status(500).status(err);
    
    CustomerTaggingTransaction.create(req.body,function(err,customerTaggingTransaction){
	if(err) return res.status(500).send(err);
        var result = Array.isArray(customerTaggingTransaction) ?
	    customerTaggingTransaction : [customerTaggingTransaction];
        
        return res.status(200).json(result.map(function(d){
          return d._id;
        }));
     });
  });
};

// Get list of CustomerTaggingTransactions
exports.index = function(req, res) {

};
exports.list = function(req, res) {

};
// Get a single CustomerTaggingTransaction
exports.show = function(req, res) {
  
  
};

// Creates a new CustomerTaggingTransaction in the DB.
exports.create = function(req, res) {
  var duration = req.body.duration;

  TaggingTransaction.findOne({tagging_code:req.body.tagging_code},function(err, tagging_transaction){

    if(tagging_transaction){

        var sla = tagging_transaction.sla;
        var exceeding_sla = false;
        var explode_time = duration.split(":");
        var minute = explode_time[0];
        var second = explode_time[1];

        if(parseInt(minute) > parseInt(sla)){

          exceeding_sla = true;

        }else if(parseInt(minute) == parseInt(sla)){

          if(parseInt(second) > 0){

            exceeding_sla = true;

          }

        }

        CustomerTaggingTransaction.create(req.body, function(err, customer_tagging_transaction) {

          if(customer_tagging_transaction){

            customer_tagging_transaction.exceeding_sla = exceeding_sla;
            customer_tagging_transaction.save(function(data){

              if(err) { 
                return res.status(200).json({
                  result: "failed",
                  message: "Server Error",
                  log: err
                });
              }else{
                return res.status(200).json({
                  result: "success",
                  message: "Successfully save transaction!"
                });
              }

            });

          }
          
          
        });

    }      

  });

  
};

exports.close_transaction = function(req, res) {
  
  var id = req.body.customer_ticket_id;
  var data_counter_list = [];
  var data_waiting_list = [];

  CustomerTaggingTransaction.create(req.body, function(err, CustomerTaggingTransaction) {
    if(err) { 
      return res.status(200).json({
        result: "failed",
        message: "Server Error",
        log: err
      });
    }else{

      /* find current customer ticket */
      CustomerTicket.findById(id, function(err, data){

        if(data){
            /* set current customer ticket status to be 'done' */
          data.status = 'done';

          // send SMS thanks for this customer
          console.log(data.mdn);
          SendSMS(data.mdn, 
              "Terima kasih telah berkunjung ke Galeri.");

          data.save(function(err, cst){

            Gallery.findOne({name : data.gallery},function(err, gallery){

              if(err){

                return res.status(200).json({ result: "failed", message: "Server Error", log: err });
              
              }
              if(gallery){

                CustomerTicket.find({
                  gallery : data.gallery, 
                  status : 'process', 
                  date: {
                        $gte: data.date,
                        $lt: moment(data.date).add(1, 'days')
                      }
                },function(err, customer_tickets){

                    asyncLoop2( 0, customer_tickets ,'process', function() {

                      Socket.emit("tvdisplay:counter_list:"+gallery._id, data_counter_list); 

                    }); 
                    

                }); 

                CustomerTicket.find({
                  gallery : data.gallery, 
                  status : 'waiting', 
                  date: {
                        $gte: data.date,
                        $lt: moment(data.date).add(1, 'days')
                      }
                },function(err, customer_tickets){

                    asyncLoop2( 0, customer_tickets ,'waiting', function() {

                      Socket.emit("tvdisplay:waiting_list:"+gallery._id, data_waiting_list); 

                    }); 

                }); 
                
                return res.status(200).send("ok");

              }else{
                return res.status(200).json({ result: "failed", message: "Invalid gallery_id"});
              }

            });


          });

        }else{

            return res.status(200).json({ result: "failed", message: "No customer found!"});

        }
        

      });

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

            if (i == 3) {
              SendSMS(data_waiting_list[i]['mdn'],
                  "Giliran Anda sebentar lagi.");
            }

          }   
          
          asyncLoop2( i+1, customer_tickets, status, callback );

        });
    
      } else {

        callback();
    
      }
  }
};

// Updates an existing CustomerTaggingTransaction in the DB.
exports.update = function(req, res) {
 
};

// Deletes a CustomerTaggingTransaction from the DB.
exports.destroy = function(req, res) {
  
};

function handleError(res, err) {
  return res.status(500).send(err);
}
