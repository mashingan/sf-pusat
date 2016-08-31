/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /galleries              ->  index
 * POST    /galleries              ->  create
 * GET     /galleries/:id          ->  show
 * PUT     /galleries/:id          ->  update
 * DELETE  /galleries/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var formidable = require('formidable');
var moment = require('moment');
var async = require('async');
var fs = require('fs');
var path = require('path');
var Gallery = require('./gallery.model');
var CustomerTicket = require('../cst_ticket/cst_ticket.model');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var Config = require('../configuration/configuration.model');
var Socket = null;

var TaggingTransaction = require('../tagging_transaction/tagging_transaction.model');
var TypeOfBreaktime = require('../type_of_breaktime/typeofbreaktime.model');
var TypeOfService = require('../type_of_service/typeofservice.model');


exports.socketHandler = function (socket, socketio) {

    Socket = socketio;
};

//local update
exports.localSync = function(req,res){
  Gallery.findById(req.params.id,function(err,gallery){
    if(err)return res.status(500).send(err);
    if(!gallery) res.status(404).send('Gallery is not found, please check your gallery id');

    // getting ipAddress and saving it
    // req.connection.remoteAddress value e.g. '::ffff:192.160.0.11'
    console.log('x-forwarded-for:', req.headers['x-forwarded-for']);
    console.log('conn remote:', req.connection.remoteAddress);
    console.log('sock remote:', req.socket.remoteAddress);
    console.log('req.ip:', req.ip);
    console.log('req.ips:', req.ips);
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
    //ip = ip.split(':');
    //ip = ip[ip.length-1];
    if (Array.isArray(ip)) ip = ip[0];
    if (gallery.ipAddress !== ip) {
      gallery.ipAddress = ip;
      gallery.save(function (errgal) {
          if (err) console.log('gallery save ip:', errgal);
          else console.log('gallery.ipAddress saved');
      });
    }
    console.log('gallery.ipAddress:', gallery.ipAddress);

    TaggingTransaction.find(function(err,tagging_transaction){
      if(err) return res.status(500).send(500);
      TypeOfBreaktime.find(function(err,typeOfBreaktime){
        if(err) return res.status(500).send(500);
        TypeOfService.find(function (err, typeOfService) {
          if (err) return res.status(500).send(err);
          return res.status(200).json({
            gallery:gallery,
            tagging_transaction:tagging_transaction,
            type_of_breaktime:typeOfBreaktime,
            type_of_service: typeOfService
          });
        })
      })    // End of TypeOfBreaktime
    })      // End of TaggingTransaction
  })        // End of Gallery
}

// Get list of galleries
exports.near_me = function(req,res){

  /* limit, order, filter */
  var limit = req.body.limit || 10;
  var page = req.body.page || 1;
  var order = req.body.order || 'name';
  var offset = (page-1) * limit;

  var queueing_count;
  var data = [];

  var coords = [];
  coords[0] = req.body.longitude;
  coords[1] = req.body.latitude;
  var hostname = req.headers.host;
  // find a location

  Config.findOne({scope:'GALLERY', key:'distance'},function(err, config_distance){

     var maxDistance = config_distance.value;
      maxDistance /= 6371;

      Gallery.find({
        location: {
          $near: coords,
          $maxDistance: maxDistance
        }
      }).sort(order).skip(offset).limit(limit).exec(function(err, galleries) {
        
        if(err){

          return res.status(200).json({ result : "failed", message : err});

        }

        if(galleries.length > 0){

          asyncLoop( 0, galleries , function() {

            return res.status(200).json({result : "success", message : "success pull data!", data : data});

          });

        }else{

          return res.status(200).json({result : "failed", message : "Data is empty."});

        }

      });

  });  

  



  function asyncLoop( i,galleries, callback ) {

      var num_rows = galleries.length;

      if( i < num_rows ) {

          var id = galleries[i].id;
          var name = galleries[i].name;
          var address = galleries[i].address;
          var picture = galleries[i].picture;
          var type_of_service = galleries[i].type_of_service;
          var today = moment().format('YYYY-MM-DD');
          var sla = 0;

          CustomerTicket.findOne({gallery : name, status : 'waiting'}).sort('-queueing_number').exec(function(err,results)  {

              for(var j = 0; j < type_of_service.length; j++){

                sla = sla + type_of_service[j].sla;

              }

              var queueing_count = 0;

              if(results){
                queueing_count = results.queueing_number;
              }

              var estimate_time = sla / type_of_service.length * queueing_count;

              if(estimate_time == null){

                estimate_time = 0;

              }

              var pict = [];

              for(var k = 0; k < galleries[i].picture.length;k++){

                  var img_path = "http://" + hostname + "/media/gallery/" + galleries[i].picture[k];

                  pict.push(img_path);

              }

              data.push({ id : id, name : name, open_days: galleries[i].open_days, latitude : galleries[i].location[1],longitude: galleries[i].location[0], date: today, address : address, queueing_count : queueing_count, picture : pict, estimate_waiting_time : estimate_time });

              asyncLoop( i+1, galleries, callback );

          })

      } else {

          callback();

      }
  }
}
exports.set_gallery_open = function(req, res){

  var gallery = req.body.gallery;
  var data = [];

  Gallery.findOne({ name : gallery, is_opened : false }, function(err, gallery){

    if(gallery){

      gallery.is_opened = true;
      gallery.save(function(){

        Gallery.find({is_opened:true},function(err, galleries){

          asyncLoop( 0, galleries, function(){

             Socket.emit("gallery:online", data); 
             
             return res.status(200).send("ok");

          });

        });

      });

    }else{

      return res.status(200).send("ok");

    }

  });

  function asyncLoop( i, galleries, callback ) {

      var num_rows = galleries.length;
      var pict = "";
      if( i < num_rows ) {
          
          if(galleries[i].picture.length!=0){
            pict = galleries[i].picture[0];
            fs.stat(path.join(__dirname,"../../../client/media/gallery/"+galleries[i].picture[0]), function(err, stat) {
                
                if(err){
                  pict = 'default_gallery.png';
                }

                data.push({
                  name: galleries[i].name,
                  picture: pict
                });

                asyncLoop( i+1, galleries, callback );

            });
          }else{

            data.push({
              name: galleries[i].name,
              picture: 'default_gallery.png'
            });

            asyncLoop( i+1, galleries, callback );

          }

      } else {

        callback();
    
      }
  }  
}  

exports.gallery_open = function(req, res){

  var data = [];

  Gallery.find({is_opened:true},function(err, galleries){

    asyncLoop( 0, galleries, function(){

       res.status(200).json(data);
     
    });

  }); 
  function asyncLoop( i, galleries, callback ) {

      var num_rows = galleries.length;
      var pict = "";
      if( i < num_rows ) {
          
          if(galleries[i].picture.length!=0){
            pict = galleries[i].picture[0];
            fs.stat(path.join(__dirname,"../../../client/media/gallery/"+galleries[i].picture[0]), function(err, stat) {
                
                if(err){
                  pict = 'default_gallery.png';
                }

                data.push({
                  name: galleries[i].name,
                  picture: pict
                });

                asyncLoop( i+1, galleries, callback );

            });
          }else{

            data.push({
              name: galleries[i].name,
              picture: 'default_gallery.png'
            });

            asyncLoop( i+1, galleries, callback );

          }

      } else {

        callback();
    
      }
  }  

}
exports.index = function(req, res) {

  var limit = req.params.limit || 10;
  var page = req.params.page || 1;
  var order = req.params.order || 'name';
  var offset = (page-1) * limit;
  var hostname = req.headers.host;
  if(req.params.filter){

    var re = new RegExp(req.params.filter, 'i');
    var filter = [
      { 'name': { $regex: re }},
      { 'province': { $regex: re }},
      { 'city': { $regex: re }}
    ];

  }else{

    var filter = '-';

  }

  var queueing_count;
  var data = [];

  if(req.params.filter!='-'){
    Gallery.find({},function(err, galleries){

      if(err){

        return res.status(200).json({ result : "failed", message : err});

      }

      if(galleries){

        asyncLoop( 0, galleries , function() {

          return res.status(200).json({ result : "success", message: "success pull data!", data : data });

        });

      }else{

        return res.status(200).json({result : "failed", message : "Data is empty."});

      }



    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{
    Gallery.find({},function(err, galleries){

      if(err){

        return res.status(200).json({ result : "failed", message : err});

      }

      if(galleries){

        asyncLoop( 0, galleries , function() {

          return res.status(200).json({ result : "success", message: "success pull data!", data : data });

        });

      }else{

        return res.status(200).json({result : "failed", message : "Data is empty."});

      }



    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }


  function asyncLoop( i,galleries, callback ) {

      var num_rows = galleries.length;

      if( i < num_rows ) {

          var id = galleries[i].id;
          var name = galleries[i].name;
          var address = galleries[i].address;
          var picture = galleries[i].picture;
          var type_of_service = galleries[i].type_of_service;
          var today = moment().format('YYYY-MM-DD');
          var sla = 0;
          var latitude = 0;
          var longitude = 0;

          CustomerTicket.findOne({gallery : name, status : 'waiting'}).sort('-queueing_number').exec(function(err,results)  {

              for(var j = 0; j < type_of_service.length; j++){

                sla = sla + type_of_service[j].sla;

              }

              var queueing_count = 0;

              if(results){
                queueing_count = results.queueing_number;
              }

              var estimate_time = sla / type_of_service.length * queueing_count;

              if(estimate_time == null){

                estimate_time = 0;

              }

              var pict = [];

              for(var k = 0; k < galleries[i].picture.length;k++){

                  var img_path = "http://" + hostname + "/media/gallery/" + galleries[i].picture[k];

                  pict.push(img_path);

              }

              if(galleries[i].location){
                latitude = galleries[i].location[1];
                longitude = galleries[i].location[0];
              }

              data.push({ id : id, name : name, date: today, open_days: galleries[i].open_days, latitude : latitude,longitude: longitude, address : address, queueing_count : queueing_count, picture : pict, estimate_waiting_time : estimate_time });

              asyncLoop( i+1, galleries, callback );

          })

      } else {

          callback();

      }
  }

};
/**
 * Get list of users
 * restriction: 'admin'
 */
exports.list = function(req, res) {

  var limit = req.params.limit;
  var page = req.params.page;
  var order = req.params.order;
  var offset = (page-1) * limit;
  var re = new RegExp(req.params.filter, 'i');
  var filter = [
    { 'name': { $regex: re }}
  ];

  var c;
  Gallery.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    Gallery.find({}, function (err, galleries) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_gallery': galleries}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Gallery.find({}, function (err, galleries) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_gallery': galleries}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);

  }


};
exports.gallery_stat_count = function(req, res){

  Gallery.count({}, function(err, count){

    if(err){

      res.status(200).json({result:"failed", message: "Server Error", log:err});

    }else{

      res.status(200).json({result:"success", count:count});

    }

  });

}
// Get a single gallery

exports.show_by_name = function(req,res){

  Gallery.findOne({name: req.params.name}, function (err, gallery) {

    if(err){
      res.status(200).json({ result: "failed", message : "Server Error", log: err});
    }

    if(gallery){

      res.status(200).json(gallery);

    }else{

      res.status(200).json({ result: "failed", message : "No Data Found"});

    }

  });

}

exports.show = function(req, res) {
  var hostname = req.headers.host;
  var latitude = 0;
  var longitude = 0;

  Gallery.findById(req.params.id, function (err, gallery) {
    if(err) { return handleError(res, err); }

    if(!gallery) { return res.status(404).send('Not Found'); }

    var pict = [];

    for(var k = 0; k < gallery.picture.length; k++){

        var img_path = "https://" + hostname + "/media/gallery/" + gallery.picture[k];

        pict.push(img_path);

    }

    CustomerTicket.findOne({gallery : gallery, status : 'waiting'}).sort('-queueing_number').exec(function(err,results)  {

      var sla = 0;

      for(var j = 0; j < gallery.type_of_service.length; j++){

        sla = sla + gallery.type_of_service[j].sla;

      }

      var queueing_count = 0;

      if(results){

        queueing_count = results.queueing_number;

      }

      var estimate_time = sla / gallery.type_of_service.length * queueing_count;

      if(estimate_time == null){

        estimate_time = 0;

      }

      if(gallery.location){

        latitude = gallery.location[1];
        longitude = gallery.location[0];

      }
      return res.json({

        result: 'success',
        id: gallery._id,
        name: gallery.name,
        address: gallery.address,
        city: gallery.city,
        estimate_time: estimate_time,
        province: gallery.province,
        longitude: longitude,
        latitude: latitude,
        counter_count: gallery.counter_count,
        running_text: gallery.running_text,
        promo: gallery.promo,
        is_opened: gallery.is_opened,
        active: gallery.active,
        type_of_service: gallery.type_of_service,
        open_days: gallery.open_days,
        picture: pict

      });

    });

  });
};

exports.delete_cover = function(req,res){

  var cover_index = req.params.cover_index;
  var id = req.params.id;

  Gallery.findById(id,function(err, gallery){


    if(gallery.picture){

        var remove_item = gallery.picture[cover_index];

        gallery.picture.splice( cover_index, 1 );

        gallery.save(function(err, items){

          /* unlink old picture */
          require("fs").unlink("client/media/gallery/" + remove_item, function(err) {

              res.status(200).json({result : "success", message : "Delete successfully!" ,remove_item : remove_item});

          });

        });



    }

  });

}

// Creates a new gallery in the DB.
exports.create = function(req, res) {

  var form = new formidable.IncomingForm();
  var ua_dashboard = [];
  var ua_modul = [];

  form.uploadDir = path.join(__dirname,"../../../client/media/gallery");
  //file upload path
  form.parse(req, function(err, fields, files) {


    var type_of_service = JSON.parse(fields.type_of_service).map(function(item) {
                                delete item.$$hashKey;
                                return item;
                            });

    var open_days = JSON.parse(fields.open_days).map(function(item) {
                                delete item.$$hashKey;
                                return item;
                            });
    req.body.picture = [];

    for(var i = 0; i < Object.keys(files).length; i++){
      req.body.picture.push(files['files['+i+']'].name);
    }

    req.body.name = fields.name;
    req.body.address = fields.address;
    req.body.city = fields.city;
    req.body.province = fields.province;
    req.body.location = [fields.longitude,fields.latitude];
    req.body.type_of_service = type_of_service;
    req.body.counter_count = fields.counter_count;
    req.body.running_text = fields.running_text;
    req.body.active = fields.active;
    req.body.promo = fields.promo;
    req.body.open_days = open_days;


    Gallery.create(req.body, function(err, gallery) {

      UserActivity.create({ modul : 'Gallery', action: 'Create', user: fields.user_op },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Gallery' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:gallery", ua_modul);
              
            });

        }).sort({ createdAt : -1 })
          .limit(5); 

        /* count gallery and update stat dashboard */
        Gallery.count({}, function(err, count){

          if(!err){

            /* send info to socket */
            Socket.emit("stat:gallery:count", count);

          }

        });

      });

      if(err) { return handleError(res, err); }
      return res.status(200).json(gallery);
    });


  });
  form.on ('fileBegin', function(name, file){
      file.path = form.uploadDir + "/" + file.name;
      //modify file path
  });

  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 

};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  var ua_dashboard = [];
  var ua_modul = [];
  Gallery.findById(req.params.id, function (err, gallery) {
    if(err) { return handleError(res, err); }
    if(!gallery) { return res.status(404).send('Not Found'); }
    gallery.remove(function(err) {
      if(err) { return handleError(res, err); }
      UserActivity.create({ modul : 'Gallery', action: 'Delete', user: req.params.user },function(err, log){

        /* find log activity then update data on dashboard */
        UserActivity.find({}, function (err, ua) {
           
            asyncLoop( 0, ua, 'dashboard', function(){

                /* send info to socket */
                Socket.emit("activity:user", ua_dashboard); 

              
            });

        }).sort({ createdAt : -1 })
          .limit(5);

        /* find log activity then update data on modul activity */
        UserActivity.find({modul: 'Gallery' }, function (err, ua) {
           
            asyncLoop( 0, ua, 'modul', function(){

              /* send info to socket */
              Socket.emit("activity:modul:gallery", ua_modul);
              
            });

        }).sort({ createdAt : -1 })
          .limit(5);  

        /* count gallery and update stat dashboard */
        Gallery.count({}, function(err, count){

          if(!err){

            /* send info to socket */
            Socket.emit("stat:gallery:count", count);

          }

        });  

      });
      return res.status(204).send('No Content');
    });
  });
   function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 
};
exports.update = function(req, res, next) {

  var ua_dashboard = [];
  var ua_modul = [];
  var form = new formidable.IncomingForm();

  form.uploadDir = path.join(__dirname,"../../../client/media/gallery");
  //file upload path
  form.parse(req, function(err, fields, files) {

    Gallery.findById(fields.id,function(err, gallery){


      if(gallery){

        var type_of_service = JSON.parse(fields.type_of_service).map(function(item) {
                                    delete item.$$hashKey;
                                    return item;
                                });
      
/*
        var type_of_service = [];
        TypeOfService.find({}, function (err, result) {
          for (var i; i < result.length; i++)
            type_of_service.push(result[i].name);
        });
*/

        var open_days = JSON.parse(fields.open_days).map(function(item) {
                                    delete item.$$hashKey;
                                    return item;
                                });


        for(var i = 0; i < Object.keys(files).length; i++){
          gallery.picture.push(files['files['+i+']'].name);
        }

        gallery.name = fields.name;
        gallery.address = fields.address;
        gallery.city = fields.city;
        gallery.province = fields.province;
        gallery.location = [fields.longitude,fields.latitude];
        gallery.type_of_service = type_of_service;
        gallery.counter_count = fields.counter_count;
        gallery.running_text = fields.running_text;
        gallery.active = fields.active;
        gallery.promo = fields.promo;
        gallery.open_days = open_days;

        gallery.save(function(err){

          UserActivity.create({ modul : 'Gallery', action: 'Update', user: fields.user_op },function(err, log){

              /* find log activity then update data on dashboard */
              UserActivity.find({}, function (err, ua) {
                 
                  asyncLoop( 0, ua,'dashboard', function(){

                      /* send info to socket */
                      Socket.emit("activity:user", ua_dashboard); 

                    
                  });

              }).sort({ createdAt : -1 })
                .limit(5);

              /* find log activity then update data on modul activity */
              UserActivity.find({modul: 'Gallery' }, function (err, ua) {
                 
                  asyncLoop( 0, ua,'modul', function(){

                    /* send info to socket */
                    Socket.emit("activity:modul:gallery", ua_modul);
                    
                  });

              }).sort({ createdAt : -1 })
                .limit(5);  

          });

          Socket.emit("tvdisplay:running_text:"+fields.id, fields.running_text); 

          if(err){

            return res.status(200).json({ result : "failed", message : 'Server Error', log : err });

          }else{

            return res.status(200).json({ result : "success", message : 'Data has been updated!' });

          }


        });

      }else{

        return res.status(200).json({ result : "failed", message : 'Gallery Not Found. Invalid ID.'});

      }

    });

  });
  form.on ('fileBegin', function(name, file){
      file.path = form.uploadDir + "/" + file.name;
      //modify file path
  });

  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 

};
/**
 * Deletes all selected user
 * restriction: 'admin'
 */
exports.destroy_all = function(req, res) {
  var galleries = req.body;
  var ua_dashboard = [];
  var ua_modul = [];

  for (var index in galleries) {

      Gallery.findByIdAndRemove(galleries[index]._id, function(err, gallery) {

      });
  }
  UserActivity.create({ modul : 'Gallery', action: 'Delete Multiple Row', user: req.params.user },function(err, log){

      /* find log activity then update data on dashboard */
      UserActivity.find({}, function (err, ua) {
         
          asyncLoop( 0, ua,'dashboard', function(){

              /* send info to socket */
              Socket.emit("activity:user", ua_dashboard); 

            
          });

      }).sort({ createdAt : -1 })
        .limit(5);

      /* find log activity then update data on modul activity */
      UserActivity.find({modul: 'Gallery' }, function (err, ua) {
         
          asyncLoop( 0, ua,'modul', function(){

            /* send info to socket */
            Socket.emit("activity:modul:gallery", ua_modul);
            
          });

      }).sort({ createdAt : -1 })
        .limit(5);  

      /* count gallery and update stat dashboard */
      Gallery.count({}, function(err, count){

        if(!err){

          /* send info to socket */
          Socket.emit("stat:gallery:count", count);

        }

      });  

  });

  function asyncLoop( i, ua, type, callback ) {

      var num_rows = ua.length;
      var avatar = "";
      if( i < num_rows ) {
        
      
        User.findOne({nik : ua[i].user},function(err, user){

          if(user.picture!=""){

            avatar = user.picture;
            
            fs.stat(path.join(__dirname,"../../../client/media/user/"+user.picture), function(err, stat) {
                
                if(err){
                  avatar = 'default_avatar.jpg';
                }

                if(type=="dashboard"){
                  ua_dashboard.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                }else{
                  ua_modul.push({ 

                    modul: ua[i].modul,
                    user: user.name,
                    avatar: avatar,
                    timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    action: ua[i].action

                  });
                  
                }

                asyncLoop( i+1, ua, type, callback );

            });

          }else{

            if(type=="dashboard"){
              ua_dashboard.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });
            }else{
              ua_modul.push({ 

                modul: ua[i].modul,
                user: user.name,
                avatar: 'default_avatar.jpg',
                timestamp: moment(ua[i].createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                action: ua[i].action

              });

            }

            asyncLoop( i+1, ua, type, callback );

          }

        });
    
      } else {

        callback();
    
      }
  } 

  return res.status(204).send('No Content');

};

exports.socket_test = function(req, res) {
  Gallery.findOne({name:'Gallery BEC'}, function (err, data) {

    res.status(200).json(data);

  });
};

exports.socket_test_update = function(req,res){

  var id = req.body.id;
  var running_text = req.body.running_text;

  Gallery.findById(id, function (err, gallery) {

    gallery.running_text = running_text;

    gallery.save(function (err) {

      if(!err){

        Socket.emit("tvdisplay:running_text", running_text);

        return res.status(200).json({ result:"success", message:"Running Text Updated! Check client! Must be change realtime."});

      }else{

        return res.status(200).json({ result:"failed", message:"Server Error", log: err });

      }

    });

  });

}

function handleError(res, err) {
  return res.status(500).send(err);
}
