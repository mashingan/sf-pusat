'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('kiosk', {
        url: '/kiosk/:galleryId/:galleryName',
        views:{
          '':{
            templateUrl: 'app/kiosk/kiosk.html',
            controller: 'KioskCtrl'
          }
        }
      });
  });
