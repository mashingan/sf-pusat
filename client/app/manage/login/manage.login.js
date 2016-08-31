'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('manageLogin', {
        url: '/manageLogin',
        templateUrl: 'app/manage/login/manage.login.html',
        controller: 'ManageLoginCtrl'
      });
  });
