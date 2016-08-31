'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var agentProductivityCtrlStub = {
  index: 'agentProductivityCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var agentProductivityIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './agent_productivity.controller': agentProductivityCtrlStub
});

describe('AgentProductivity API Router:', function() {

  it('should return an express router instance', function() {
    agentProductivityIndex.should.equal(routerStub);
  });

  describe('GET /api/agent_productivitys', function() {

    it('should route to agentProductivity.controller.index', function() {
      routerStub.get
        .withArgs('/', 'agentProductivityCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
