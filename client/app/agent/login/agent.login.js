'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('agentLogin', {
        url: '/agentLogin',
        views:{
          '':{
            templateUrl: 'app/agent/login/agent.login.html',
            controller: 'AgentLoginCtrl'
          },
          'time@agentLogin':{
            templateUrl:'components/time/time.html'
          }
        }

      });
  });
