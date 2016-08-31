'use strict';

var app = require('../..');
import request from 'supertest';

describe('HandsetType API:', function() {

  describe('GET /api/handset_types', function() {
    var handsetTypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/handset_types')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          handsetTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      handsetTypes.should.be.instanceOf(Array);
    });

  });

});
