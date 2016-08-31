'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var galleryImprovementCtrlStub = {
  index: 'galleryImprovementCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var galleryImprovementIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './gallery_improvement.controller': galleryImprovementCtrlStub
});

describe('GalleryImprovement API Router:', function() {

  it('should return an express router instance', function() {
    galleryImprovementIndex.should.equal(routerStub);
  });

  describe('GET /api/gallery_improvements', function() {

    it('should route to galleryImprovement.controller.index', function() {
      routerStub.get
        .withArgs('/', 'galleryImprovementCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
