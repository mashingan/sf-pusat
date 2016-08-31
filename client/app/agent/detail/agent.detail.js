'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('agentDetail', {
        url: '/agentDetail/:counter/:id/:galleryName/:galleryId',
        views:{
          '':{
            templateUrl: 'app/agent/detail/agent.detail.html',
            controller: 'AgentDetailCtrl'
          },
          'time@agentDetail':{
            templateUrl:'components/time/time.html'
          }
        }
      });
  });
