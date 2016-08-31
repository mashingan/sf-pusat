'use strict';

var _ = require('lodash');
var smpp = require('smpp');
var SmsCode = require('../sms_gateaway/sms_code.model');
var source_addr = '1013';

exports.index = function(req, res) {
  
  var session = smpp.connect('10.17.91.160', 3200);
  var otp = req.body.otp;
  var mdn = req.body.mdn;

  session.bind_transceiver({
      system_id: 'gallery',
      password: 'gal123',
      interface_version: 1,
      addr_ton: 2,
      addt_npi: 1,
  }, function(pdu) {
      if (pdu.command_status == 0) {
          
          session.submit_sm({
              source_addr: source_addr,
              destination_addr: mdn,
              short_message: otp
          }, function(pdu) {
              if (pdu.command_status == 0) {
     
                  res.status(200).json({ result: "success", message: "Successfully Sent Message!"});

              }else{

                  res.status(200).json({ result: "failed", message: "Failed Sent Message!"});

              }
          });
      }
  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
