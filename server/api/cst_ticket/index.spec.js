'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var cstTicketCtrlStub = {
  index: 'cstTicketCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var cstTicketIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './cst_ticket.controller': cstTicketCtrlStub
});

describe('CstTicket API Router:', function() {

  it('should return an express router instance', function() {
    cstTicketIndex.should.equal(routerStub);
  });

  describe('GET /api/cst_tickets', function() {

    it('should route to cstTicket.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cstTicketCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
