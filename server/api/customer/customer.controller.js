'use strict';

var Customer = require('./customer.model');
var Config = require('../configuration/configuration.model');
var nodemailer = require('nodemailer');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var path = require('path');
var http = require('http');
var User = require('../user/user.model');
var UserActivity = require('../user_activity/user_activity.model');
var SmsCode = require('../sms_gateaway/sms_code.model');
var querystring = require('querystring');
var fs = require('fs');
var Socket = null;

var smtpTransport = nodemailer.createTransport({
  host: '10.14.10.4',
  port: 25,
});



exports.socketHandler = function (socket, socketio) {

    Socket = socketio; // attaching Socket to variable
};

var validationError = function(res, err) {
  return res.status(200).json({ result : "failed", message : "validation error!", data: err});
};

/**
 * Get list of customers
 * restriction: 'admin'
 */
exports.index = function(req, res) {

  var limit = req.params.limit || 10;
  var page = req.params.page || 1;
  var order = req.params.order || 'username';
  var offset = (page-1) * limit;

  if(req.params.filter){

    var re = new RegExp(req.params.filter, 'i');
    var filter = [{ 'username': { $regex: re }}];

  }else{

    var filter = '-';

  }

  if(req.params.filter!='-'){

    Customer.find({},'-salt -hashedPassword', function (err, customers) {

      if(err){

          return res.status(200).json({ result : "failed", message : err});

      }

      if(customers.length > 0){

        return res.status(200).json({ result : "success", count : customers.length, message : 'success pull data!', data : customers});

      }else{

        return res.status(200).json({result : "failed", message : "Data is empty."});

      }

    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Customer.find({}, '-salt -hashedPassword' , function (err, customers) {

      if(err){

          return res.status(200).json({ result : "failed", message : err});

      }

      if(customers.length > 0){

        return res.status(200).json({ result : "success", count : customers.length, message : 'success pull data!', data : customers});

      }else{

        return res.status(200).json({ result : "failed", message : "Data is empty."});

      }

    })
    .sort(order)
    .skip(offset)
    .limit(limit);

  }

};
/**
 * customer login
 *
 */
exports.login = function(req, res) {
    var hostname = req.headers.host;
    var username = String(req.body.username);
    var password = String(req.body.password);

    Customer.findOne({
          username: username.toLowerCase()
        }, function(err, customer) {

          if (err) return done(err);

          if (!customer) {
            return res.status(200).json({ result: 'failed', message: 'This username is not registered.' });
          }
          if (!customer.authenticate(password)) {
            return res.status(200).json({ result: 'failed', message: 'This password is not correct.'});
          }

          return res.status(200).json({
            result: 'success',
            message: 'Login success!',
            uid: customer._id,
            name: customer.name,
            username: customer.username,
            gender: customer.gender,
            birthday: customer.birthday,
            other_number: customer.other_number,
            picture: "https://" + hostname + "/media/customer/" + customer.picture,
            city: customer.city,
            address: customer.address,
            mdn: customer.mdn,
            handsetType: customer.handsetType,
            email: customer.email
          });
    });

};
/**
 * Get list of customers
 * restriction: 'admin'
 */
exports.list = function(req, res) {

  var limit = req.params.limit;
  var page = req.params.page;
  var order = req.params.order;
  var offset = (page-1) * limit;
  var re = new RegExp(req.params.filter, 'i');
  var filter = [
    { 'username': { $regex: re }},
    { 'email': { $regex: re }}
  ];

  var c;
  User.count({},function (err, count) {
    c = count;
  });

  if(req.params.filter!='-'){

    Customer.find({}, '-salt -hashedPassword', function (err, customers) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_customer': customers}];
      res.status(200).json(j);
    })
    .or(filter)
    .sort(order)
    .skip(offset)
    .limit(limit);

  }else{

    Customer.find({}, '-salt -hashedPassword', function (err, customers) {
      if(err) return res.status(500).send(err);
      var j = [{'count':c, 'data_customer': customers}];
      res.status(200).json(j);
    })
    .sort(order)
    .skip(offset)
    .limit(limit);
  }


};

exports.customer_stat_count = function(req, res){

  Customer.count({}, function(err, count){

    if(err){

      res.status(200).json({result:"failed", message: "Server Error", log:err});

    }else{

      res.status(200).json({result:"success", count:count});

    }

  });

}

/**
 * Creates a new customer
 */
exports.check_mdn = function(req,res){
  
  String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
  }
  
  //Config.findOne({scope:'ZSMART_API', key:'API_URL'},function(err, config){
  
      var mdn = req.body.mdn.toString();
      var pos62 = mdn.indexOf("62");

     if (pos62 !== 0 && mdn.indexOf('08') === 0)
       mdn = '62' + mdn.substr(1);

      var data = querystring.stringify({
        mdn: mdn,
        user: 'tt_user',
        pass: 'tt@Smartfren2016',
      });
  
     // return res.status(200).json(data);

     var options = {
          //host : config.value,
          host : '10.14.14.34',
          port: 7070,
          path : '/zsmart_api/get_subs_info.php?' + data,
          method: 'GET',
      };

      var result = '';

      var request = http.request(options, function(response) {
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
              result += chunk;
          });
          response.on('end', function () {
            
            var data_parse =  JSON.parse(result);

            if(data_parse.customerName) {

              res.set('Content-Type', 'application/json');
              res.status(200).json({
                result: 'success',
                message: 'success',
                mdn: data_parse.MDN,
                other_number: data_parse.MDNSecondary,
                name: data_parse.customerName,
                email: data_parse.emailAddress,
                birthday: data_parse.birthday.split(' ')[0],
                gender: data_parse.gender === '0' ? 'male' : 'female',
                address: data_parse.address,
                city: data_parse.areaName,
                customer_grade: data_parse.customerGrade
              });


              }else{
                res.set('Content-Type', 'application/json');
                res.status(200).json({
                  result: 'Failed',
                  message: 'Check your mdn number'
                });
              }
            
          });
      });

      request.on('error', function(e) {
          res.status(200).json({
            result: 'failed',
            message: e
          });

      });

      //request.write(data);
      request.end();
  
 //});


}

exports.verify_customer = function (req, res){

  var activation_code = req.body.activation_code;
  var username = req.body.username;

  Customer.findOne({activation_code: activation_code, username: username} ,function(err, customer){

      if(customer){

        customer.status = true;
        customer.save(function(){

          res.status(200).json({ result: "success", message: "Your Account successfully activated"});

        });

      }else{

        res.status(200).json({ result: "failed", message: "Invalid activation_code!"});

      }

  });


}

exports.check_otp = function (req, res, next) {

  var otp = req.body.otp;
  var customer = req.body.customer;

  SmsCode.findOne({ customer : customer , code : otp}, function(err, existingUser){

    if(existingUser.length > 0){

      existingUser.status = '1';
      existingUser.save(function(err){

        if(!err){

          res.status(200).json({
            result: "success",
            message: "Verification successfully"
          });

        }else{

          res.status(200).json({
            result: "failed",
            message: "Verification failed"
          });

        }

      });

    }

  });  

}  

exports.create = function (req, res, next) {

  var hostname = req.headers.host;
  var uniqcode = Math.floor(Math.random() * 90000) + 10000;

  console.log('req.body:', req.body);
  console.log('picture:', req.body.picture);
  if(req.body.picture){
      var uuid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
      fs.writeFile(path.join(__dirname,"../../../client/media/customer/" + uuid + ".jpg"), req.body.picture, 'base64', function(err) {
        if(err){
          return res.status(200).json({ result : "failed", message: "Upload failed.", log : err });
        }
        req.body.picture =  uuid + ".jpg";
      });

  }

  //req.body.activation_code = uniqcode;

  var newCustomer = new Customer(req.body);

  newCustomer.save(function(err, customer) {

    if(err){
      console.log(err);
/*
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(200).json({
          result: 'failed',
          message:  'username or email already used'
        });

      }
*/

/*
      if(err.errors.email){
        delete err.errors.email.properties;
        delete err.errors.email.stack;
        delete err.errors.email.name;
        delete err.errors.email.kind;
        delete err.errors.email.path;
      }
      if(err.errors.username){
        delete err.errors.username.properties;
        delete err.errors.username.stack;
        delete err.errors.username.name;
        delete err.errors.username.kind;
        delete err.errors.username.path;
      }
      var err_msg = err.errors;
*/
/*
      var err_msg = err.errors.email? err.errors.email.message :
        err.errors.username? err.errors.username.message :
        'validation error';
*/
      //var err_msg = 'email telah terpakai';
      var err_msg = err.errors.email.Error? err.errors.email.Error.message :
        err.errors.username.Error? err.errors.username.Error.message :
        'email atau username telah terdaftar';
      console.log(err_msg);
      return res.status(200).json({
        result: 'failed',
        message: err_msg
      });
    }else{
      if (customer.username !== customer.email) {
        return res.status(404).json({
          result: 'failed',
          message: 'username is not same with email'
        });
      }

       /* count gallery and update stat dashboard */
       Customer.count({}, function(err, count){

         if(!err && Socket){
           /* send info to socket */
           Socket.emit("stat:customer:count", count);
         }

       });
       
       res.status(200).json({
           result: "success",
           message: "register successfully!",
           uid: customer._id,
           mdn: customer.mdn,
           name: customer.name,
           username: customer.username,
           customer_grade: customer.customer_grade,
           other_number: customer.other_number,
           gender: customer.gender,
           birthday: customer.birthday,
           email: customer.email,
           picture: "https://" + hostname + "/media/customer/" + uuid + ".jpg",
           city : customer.city,
           address : customer.address,
           handsettype : customer.handsetType
       });
    }
    // end of newCustomer.save
  });
};


/**
 * Get a single customer
 */
exports.show = function (req, res, next) {
  var customerId = req.params.id;
  var hostname = req.headers.host;

  Customer.findById(customerId, function (err, customer) {
    if (err) {
      return res.status(200).json({ result : "failed", message: "Server Error.", log : err });
    }
    if (!customer) {
      return res.status(200).json({ result : "failed", message: "User doesn't exist."});
    }
    console.log('hostname:', hostname);
    console.log('picture:', customer.picture);
    return res.status(200).json({

        result: 'success',
        message: 'successfully get data!',
        uid: customer._id,
        name: customer.name,
        username: customer.username,
        mdn: customer.mdn,
        customer_grade: customer.customer_grade,
        other_number: customer.other_number,
        gender: customer.gender,
        birthday: customer.birthday,
        email: customer.email,
        picture: "https://" + hostname + "/media/customer/" + customer.picture,
        city : customer.city,
        address : customer.address,
        handsettype : customer.handsetType

    });

  });
};

/**
 * Deletes a customer
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Customer.findByIdAndRemove(req.params.id, function(err, customer) {
    if(err) return res.status(500).send(err);
    /* count gallery and update stat dashboard */
    Customer.count({}, function(err, count){

      if(!err && Socket){
        /* send info to socket */
        Socket.emit("stat:customer:count", count);
      }

    });
    return res.status(204).send('No Content');
  });
};

/**
 * Deletes all selected user
 * restriction: 'admin'
 */
exports.destroy_all = function(req, res) {
  var customers = req.body;

  for (var index in customers) {

      User.findByIdAndRemove(customers[index]._id, function(err, customer) {

      });
  }
  /* count gallery and update stat dashboard */
  Customer.count({}, function(err, count){

    if(!err && Socket){
      /* send info to socket */
      Socket.emit("stat:customer:count", count);
    }

  });
  return res.status(204).send('No Content');
};

exports.validateRecoveryCode = function(req, res) {

  var recovery_code = req.body.recovery_code;
  var email = req.body.email;

  Customer.findOne({email:email,recovery_code:recovery_code}, function (err, customer) {

    if(err){
      return res.status(200).json({ result: 'failed', message: 'Server Error', log: err });
    }

    if(customer){
      return res.status(200).json({ result: 'success', validate: true, customer_id: customer._id });
    }else{
      return res.status(200).json({ result: 'failed', validate: false, message: 'Invalid Recovery Code.' });
    }

  });

};

exports.forgotPassword = function(req, res) {

   var email = req.body.email;

   Customer.findOne({email:email}, function (err, customer) {

      if(err){

        return res.status(200).json({ result: 'failed', message: 'Server Error', log: err });

      }else{

        if(customer){
          Config.findOne({scope:'EMAIL_TEMPLATE', key:'subject'},function(err, email_subject){
            Config.findOne({scope:'EMAIL_TEMPLATE', key:'from'},function(err, email_from){
              Config.findOne({scope:'EMAIL_TEMPLATE', key:'template'},function(err, email_template){
                var uniqcode = Math.floor(Math.random() * 90000) + 10000;

                var template_filter = email_template.value.replace("{{customer}}", customer.name);
                var html = template_filter.replace("{{uniqcode}}",uniqcode);

                var mailOptions =  {
                  from: email_from.value + " <queuing@smartfren.com>",
                  to: email,
                  subject: email_subject.value,
                  html: html
                };

                smtpTransport.sendMail(mailOptions, function (err, response) {
                  if (err) {
                    console.log('Sending email error:', err)
                    return res.status(200).json({
                      result: 'failed',
                      message: 'email has not been sent'
                    });
                  } else {
                    console.log(response.response.toString());
                    console.log('Message sent:', response.message);

                    customer.recovery_code = uniqcode;
                    customer.save();
                    return res.status(200).json({
                      result: 'success',
                      message: response.message
                    });
                  }
                });

              }); // template
            });	  // from
          });	  // subject
/*

          Config.findOne({scope:'SMTP', key:'smtp_user'},function(err, config_smtp_user){

            Config.findOne({scope:'SMTP', key:'smtp_password'},function(err, config_smtp_password){

              Config.findOne({scope:'EMAIL_TEMPLATE', key:'subject'},function(err, email_subject){

                Config.findOne({scope:'EMAIL_TEMPLATE', key:'from'},function(err, email_from){

                 Config.findOne({scope:'EMAIL_TEMPLATE', key:'template'},function(err, email_template){
                    

                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: config_smtp_user.value,
                            pass: config_smtp_password.value
                        }
                    });
                    var uniqcode = Math.floor(Math.random() * 90000) + 10000;

                    var template_filter = email_template.value.replace("{{customer}}", customer.username);
                    var html = template_filter.replace("{{uniqcode}}",uniqcode);

                    var mailOptions = {
                        from: email_from.value,
                        to: email,
                        subject: email_subject.value,
                        html: html
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){

                            return res.status(200).json({ result: 'failed', message: 'Can not send mail', log: error });

                        }else{

                            customer.recovery_code = uniqcode;
                            customer.save(function(err){

                              if(err){

                                return res.status(200).json({ result: 'failed', message: 'Server Error', log: error });

                              }else{

                                return res.status(200).json({ result: 'success', email: customer.email, message: 'Recover Password has been sent.', info: info.response });

                              }

                            });


                        };
                    });

                 }); 

                }); 

              });  

            });  

          });  


*/
        }else{

          res.status(200).json({ result: 'failed', message: 'Email not registered.' });

        }

      }

   });


}

/**
 * Change a customer password
 */
exports.changePassword = function(req, res, next) {
  var customerId = req.body.id;
  var oldPass = String(req.body.oldpassword);
  var newPass = String(req.body.newpassword);

  Customer.findById(customerId, function (err, customer) {
    if(customer.authenticate(oldPass)) {
      customer.password = newPass;
      customer.save(function(err) {
        if(err){
          return validationError(res, err);
        }else{
          return res.status(200).json({ result : "success", message: "Password successfully changed."});
        }

      });
    } else {
      return res.status(200).json({ result : "failed", message: "Invalid old password."});
    }
  });
};
/**
 * Change a customer password
 */
exports.resetPassword = function(req, res, next) {
  var customerId = req.body.id;
  var newPass = String(req.body.newpassword);

  Customer.findById(customerId, function (err, customer) {

      if(err){

        return validationError(res, err);

      }else{
        customer.password = newPass;
        customer.save(function(err) {
          if(err){

            return validationError(res, err);

          }else{

            return res.status(200).json({
              result : "success",
              message: "Password successfully reset.",
              username: customer.username,
              picture: customer.picture,
              city: customer.city,
              mdn: customer.mdn,
              handsetType: customer.handsetType,
              email: customer.email
            });

          }
        });
      }

  });

};

exports.update = function(req, res, next) {

  var mdn = String(req.body.mdn);
  var gender = String(req.body.gender);
  var birthday = String(req.body.birthday);
  var other_number = String(req.body.other_number);
  var city = String(req.body.city);
  var address = String(req.body.address);
  var handsetType = String(req.body.handsetType);
  var hostname = req.headers.host;
  var name = String(req.body.name);
  var id = req.body.id;
  var newPass = String(req.body.newpassword);

  Customer.findById(id, function (err, customer) {

      if(!customer){

        return res.status(200).json({ result: "failed", "message": "Invalid customer id!"});

      }
      customer.mdn = mdn;
      customer.city = city;
      customer.address = address;
      customer.handsetType = handsetType;
      customer.name = name;


/*
      if(newPass!=""){
        customer.password = newPass;
      }
*/

      if(req.body.picture){

        var uuid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
        fs.writeFile(path.join(__dirname,"../../../client/media/customer/" + uuid + ".jpg"), req.body.picture, 'base64', function(err) {
          if(err){
            return res.status(200).json({ result : "failed", message: "Upload failed.", log : err });
          }
        });
        customer.picture = uuid + ".jpg";

        /* unlink old picture */
        if(customer.picture!=""){
            fs.unlink("client/media/customer/" + customer.picture, function(err) {

            });
        }


      }

      customer.save(function(err,data) {
        if(err){
          if (err.code === 11000 && err.name == 'MongoError') {
            return res.status(404).json({
              result: 'failed',
              message: 'Update failed because of already used email/username'
            });
          }

/*
          if(err.errors.email){
            delete err.errors.email.properties;
            delete err.errors.email.stack;
            delete err.errors.email.name;
            delete err.errors.email.kind;
            delete err.errors.email.path;
          }
*/
          //var err_msg = err.errors;
          var err_msg = err.errors.email? err.errors.email.message :
            err.errors.username? err.errors.username.message :
            "validation error!";
          //return validationError(res, err_msg);
          return res.status(200).json({
            result: 'failed',
            message: err_msg
          });
        }else{
          if (data.username !== data.email) {
            return res.status(404).json({
              result: 'failed',
              message: 'username is not same with email'
            });
          }
          res.status(200).json({
            result: "success",
            message: "profile successfully updated!",
            username: data.username,
            name: data.name,
            gender: data.gender,
            birthday: data.birthday,
            other_number: data.other_number,
            email: data.email,
            mdn: data.mdn,
            picture: "https://" + hostname + "/media/customer/" + data.picture,
            city : data.city,
            address : data.address,
            handsettype : data.handsetType
          });
        }
      });

  });

};
/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var customerId = req.customer._id;
  Customer.findOne({
    _id: customerId
  }, '-salt -hashedPassword', function(err, customer) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!customer) return res.status(401).send('Unauthorized');
    res.json(customer);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
