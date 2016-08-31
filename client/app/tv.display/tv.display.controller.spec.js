'use strict';

describe('Controller: TvDisplaylCtrl', function () {

  // load the controller's module
  beforeEach(module('smartfrenApp'));

  var TvDisplaylCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TvDisplaylCtrl = $controller('TvDisplaylCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
