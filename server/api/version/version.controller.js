var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var Version = require('./version.model');
var version;

module.exports.getVersion = function (req, res) {
  Version.findOne().sort('-created_at').exec(function(err, latest) {
    if (err) {
      console.log('Cannot retrieve latest version:', err.message);
      return res.status(500).json({
        result: 'failed',
        message: 'Cannot retrieve latest version: ' + err.message
      });
    }
    else if (latest && latest.version) {
      console.log('Latest version retrieved: ', latest.version)
      version = latest.version;
      return res.status(200).json({
        result: 'success',
        message: 'latest version is ' + latest.version
      });
    }
    else {
      console.log('No latest file available');
      console.log(latest);
      return res.status(404).json({
        result: 'failed',
        message: 'No latest file available'
      });
    }
  });
};

module.exports.uploadUpdate = function (req, res) {
  var form = new formidable.IncomingForm();
  form.multiple = true;
  form.uploadDir = path.join(__dirname,
    '../../../client', 'media', 'version');

  form.on('field', function (name, value) {
    if (name === 'version') {
      version = value;
      Version.create({ version: value }, function (err, doc) {
        if (err) {
          console.log('Cannot save version number:', err);
        }
        else {
          console.log('New version is saved:', value);
        }
      });
    }
  });

  form.on('file', function (field, file) {
    console.log('Saving file:', file.name);
    var newname = path.join(form.uploadDir, file.name);
    fs.rename(file.path, newname, function (err) {
      if (err) console.log('Cannot rename/upload update');
      else {
        console.log('Update saved as', newname);
        Version.findOneAndUpdate({ version: version },
          { filepath: newname }, function (err, olddoc) {
            if (err) console.log('Cannot update path');
            else console.log('Update path successfully');
        });
      }
    });
  });

  form.on('error', function (err) {
    console.log('An error has occurred:\n' + err);
    res.status(500).json({
      result: 'failed',
      message: 'Some error happened ' + err
    });
  });

  form.on('end', function () {
    res.status(200).json({
      result: 'success',
      message: 'uploading update success'
    });
  });

  form.parse(req);
};

module.exports.getLatest = function (req, res) {
  Version.findOne().sort('-created_at').exec(function (err, latest) {
    if (err) {
      console.log('Cannot retrieve latest update');
      console.log('Err:', err.message);
      return res.status(500).json({
        result: 'failed',
        message: err.message
      });
    }
    else if (latest.filepath) {
      console.log('Sending file:', latest.filepath);
      res.status = 200;
      res.sendFile(latest.filepath);
    }
    else {
      console.log('No filepath available');
      return res.status(404).json({
        result: 'failed',
        message: 'No filepath available'
      });
    }
  });
};
