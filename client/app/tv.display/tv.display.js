'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tvDisplay', {
        url: '/tvDisplay/:galleryId/:galleryName',
        views:{
          '':{
            templateUrl: 'app/tv.display/tv.display.html',
            controller: 'TvDisplayCtrl'
          },
          'time@tvDisplay':{
            templateUrl:'components/time/time.html'
          }
        }
      });
  });
