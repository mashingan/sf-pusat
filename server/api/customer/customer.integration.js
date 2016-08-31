'use strict';

var app = require('../..');
import request from 'supertest';

describe('Customer API:', function() {

  describe('GET /api/customers', function() {
    var customers;

    beforeEach(function(done) {
      request(app)
        .get('/api/customers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      customers.should.be.instanceOf(Array);
    });

  });

});
