'use strict';

var app = require('../..');
import request from 'supertest';

describe('AgentTransaction API:', function() {

  describe('GET /api/agent_transactions', function() {
    var agentTransactions;

    beforeEach(function(done) {
      request(app)
        .get('/api/agent_transactions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          agentTransactions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      agentTransactions.should.be.instanceOf(Array);
    });

  });

});
