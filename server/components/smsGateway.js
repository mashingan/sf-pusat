var smpp = require('smpp');
var config = (require('../config/environment/index')).smsGateway;
var sender = config.sender;

module.exports = function (to,text, cbSuccess, cbFailed) {
    var session = smpp.connect(config.host, config.port);
    console.log('to bind the session');
    session.bind_transceiver({
        system_id: config.system_id,
        password: config.password,
        interface_version: 1,
        addr_ton: 2,
        addt_npi: 1,
    }, function (pdu) {
            console.log('this is ok');
            console.log(pdu.command_status);
            if (pdu.command_status === 0)
                return sendSMS(session, to, text, cbSuccess, cbFailed);
    });

    session.on('close', function () {
        console.log('smpp connection closed');
    });

    session.on('error', function (error) {
        console.log('smpp error', error);
    });
};

function lookupPDUStatusKey(pduCmdStat) {
  for (var k in smpp.errors) {
    if (smpp.errors[k] == pduCmdStat)
       return k;
  }
}

/*
function connectSMPP() {
  console.log('smpp reconnecting');
  session.connect();
}
*/

/*
 * to: String, smartfren number, e.g. "6288xxxxxx"
 * text: String, short message
 *
 * return:
 * true if the destination number is correct
 * false if otherwise
 */

function sendSMS (sess, to, text, cbSuccess, cbFailed) {
  var toNum = to;
  if (toNum.indexOf('08') === 0) toNum = '62' + toNum.substr(1);
  else if (toNum.indexOf('88') === 0) toNum = '62' + toNum;

/*
  if (to.indexOf('6288') !== 0)
    return false;
*/

  sess.submit_sm({
    source_addr: sender,
    destination_addr: toNum,
    short_message: text
  }, function (pdu) {
    console.log('sms pdu status', lookupPDUStatusKey(pdu.command_status));
    if (pdu.command_status === 0) {
      console.log(pdu.message_id);
      cbSuccess();
    } else {
      cbFailed();
    }
    sess.close();
  });

  return true;
}

/*
 * SMS sent event listener/handler
 */
/*
session.on('pdu', function (pdu) {
  if (pdu.command == 'deliver_sm') {
    var from = pdu.source_addr.toString();
    var to = pdu.destination_addr.toString();

    var text = '';
    if (pdu.short_message && pdu.short_message.message)
      text = pdu.short_message.message;

    console.log('SMS ' + from + ' -> ' + to + ': ' + text);

    session.deliver_sm_resp({ sequence_number: pdu.sequence_number });
  }
});
*/
