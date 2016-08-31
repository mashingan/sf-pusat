'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var customerCtrlStub = {
  index: 'customerCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var customerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './customer.controller': customerCtrlStub
});

describe('Customer API Router:', function() {

  it('should return an express router instance', function() {
    customerIndex.should.equal(routerStub);
  });

  describe('GET /api/customers', function() {

    it('should route to customer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'customerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
