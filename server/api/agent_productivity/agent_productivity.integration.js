'use strict';

var app = require('../..');
import request from 'supertest';

describe('AgentProductivity API:', function() {

  describe('GET /api/agent_productivitys', function() {
    var agentProductivitys;

    beforeEach(function(done) {
      request(app)
        .get('/api/agent_productivitys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          agentProductivitys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      agentProductivitys.should.be.instanceOf(Array);
    });

  });

});
