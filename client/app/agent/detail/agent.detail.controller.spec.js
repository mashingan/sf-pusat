'use strict';

describe('Controller: AgentDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('smartfrenApp'));

  var AgentDetailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgentDetailCtrl = $controller('AgentDetailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
