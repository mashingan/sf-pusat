'use strict';

var app = require('../..');
import request from 'supertest';

describe('GalleryImprovement API:', function() {

  describe('GET /api/gallery_improvements', function() {
    var galleryImprovements;

    beforeEach(function(done) {
      request(app)
        .get('/api/gallery_improvements')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          galleryImprovements = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      galleryImprovements.should.be.instanceOf(Array);
    });

  });

});
