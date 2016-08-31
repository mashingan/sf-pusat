'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var CustomerSchema = new Schema({
  username: String,
  name: String,
  mdn: String,
  gender: String,
  birthday: String,
  city: String,
  address: String,
  other_number: Number,
  customer_grade: String,
  picture: String,
  email: { type: String, lowercase: true, unique: true },
  handsetType: String,
  hashedPassword: String,
  recovery_code: Number,
  activation_code: Number,
  status: Boolean,
  salt: String
},{
    timestamps: true
});

/**
 * Virtuals
 */
CustomerSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
CustomerSchema
  .virtual('profile')
  .get(function() {
    
    return {
      'result': 'success',
      'message': 'successfully get data!',
      'username': this.username,
      'picture': this.picture,
      'city': this.city,
      'mdn': this.mdn,
      'handsetType': this.handsetType,
      'email': this.email
    };
  });

/**
 * Validations
 */

// Validate empty email
CustomerSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
CustomerSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
CustomerSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, customer) {
      if(err) throw err;
      if(customer) {
        if(self.id === customer.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

// // Validate email is not taken
// CustomerSchema
//   .path('MDN')
//   .validate(function(value, respond) {
//     var self = this;
//     this.constructor.findOne({MDN: value}, function(err, customer) {
//       if(err) throw err;
//       if(customer) {
//         if(self.id === customer.id) return respond(true);
//         return respond(false);
//       }
//       respond(true);
//     });
// }, 'MDN is already in use.');

CustomerSchema
  .path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({username: value}, function(err, customer) {
      if(err) throw err;
      if(customer) {
        if(self.id === customer.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'Username is already in use.');
var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
CustomerSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
CustomerSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Customer', CustomerSchema);
