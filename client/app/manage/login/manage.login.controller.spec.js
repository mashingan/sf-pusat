'use strict';

describe('Controller: AdminLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('smartfrenApp'));

  var AgentLoginCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgentLoginCtrl = $controller('AdminLoginCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
