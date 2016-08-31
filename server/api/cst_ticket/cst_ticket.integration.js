'use strict';

var app = require('../..');
import request from 'supertest';

describe('CstTicket API:', function() {

  describe('GET /api/cst_tickets', function() {
    var cstTickets;

    beforeEach(function(done) {
      request(app)
        .get('/api/cst_tickets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cstTickets = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cstTickets.should.be.instanceOf(Array);
    });

  });

});
