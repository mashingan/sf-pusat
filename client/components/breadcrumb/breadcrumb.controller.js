'use strict';

angular.module('smartfrenApp')
  .controller('BreadcrumbCtrl', function ($scope, $location, Auth) {

    $scope.getCurrentUser = Auth.getCurrentUser();

  });
