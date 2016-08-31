'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var agentTransactionCtrlStub = {
  index: 'agentTransactionCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var agentTransactionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './agent_transaction.controller': agentTransactionCtrlStub
});

describe('AgentTransaction API Router:', function() {

  it('should return an express router instance', function() {
    agentTransactionIndex.should.equal(routerStub);
  });

  describe('GET /api/agent_transactions', function() {

    it('should route to agentTransaction.controller.index', function() {
      routerStub.get
        .withArgs('/', 'agentTransactionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
