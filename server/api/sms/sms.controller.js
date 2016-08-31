var SMS = require('./sms.model');
var sendSMS = require('../../components/smsGateway');

function sendJSON (response, status, content) {
  response.status = status;
  response.json(content);
}

function sendSuccess (response, message) {
  sendJSON(response, 200, {
    result: 'success',
    message: message
  });
}

function sendFailed(response, status, message) {
  sendJSON(response, status, {
    result: 'failed',
    message: message
  });
}

function toSendSMS (req, res, msgType) {
  var mdn = req.query.mdn;
  SMS.findOne({ type: msgType }, function (err, msg) {
    if (err) {
      console.log('No', msgType, 'available');
      return sendFailed(res, 404,'Cannot retrieve ' +msgType+ ' message');
    }

    if (req.query.message) {
      return sendSuccess(res, msg.message);
    } else {
      sendSMS(mdn, msg.message,
        function() {
          sendSuccess(res, msgType + ' sent')
        },
        function() {
          sendFailed(res, 500, 'Server cannot send ' + msgType)
        });
    }
  });
}

module.exports.greeting = function (req, res) {
  toSendSMS(req, res, 'greeting');
};

module.exports.notification = function (req, res) {
  toSendSMS(req, res, 'notification');
};

function toUpdateMessage(req, res, msgType) {
  var message = req.body.message;
  SMS.findOneAndUpdate({ type: msgType }, { $set: { message: message }},
    function (err, doc) {
      if (err) {
        console.log('Cannot update', msgType);
        return sendFailed(res, 500, 'Server cannot update ' + msgType);
      }
      sendSuccess(res, msgType + ' updated');
  });
}

module.exports.newGreeting = function (req, res) {
  toUpdateMessage(req, res, 'greeting');
};

module.exports.newNotification = function (req, res) {
  toUpdateMessage(req, res, 'notification');
};

module.exports.createMessage = function (req, res) {
  console.log('req.body:', req.body);
  console.log('message:', req.body.message);
  console.log('type:', req.body.type);
  SMS.create(req.body, function (err, doc) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000)
        return sendFailed(res, 500, 'Message type already exists');
      return sendFailed(res, 500, 'Server cannot save message');
    }
    else return sendSuccess(res, 'Message is saved');
  });
};

module.exports.clearAll = function (req, res) {
  SMS.remove({}, function (err) {
    if (err) return sendFailed(res, 500, 'Cannot clear the db');
    else return sendSuccess(res, 'DB cleared');
  });
};
