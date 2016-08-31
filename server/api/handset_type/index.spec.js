'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var handsetTypeCtrlStub = {
  index: 'handsetTypeCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var handsetTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './handset_type.controller': handsetTypeCtrlStub
});

describe('HandsetType API Router:', function() {

  it('should return an express router instance', function() {
    handsetTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/handset_types', function() {

    it('should route to handsetType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'handsetTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
