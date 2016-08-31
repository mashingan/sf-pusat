/**
 * Created by dwiargo on 4/18/16.
 */

'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('galleries', {
        url: '/galleries/:target',
        views:{
          '':{
            templateUrl: 'app/galleries/galleries.html',
            controller: 'GalleriesCtrl'
          }
        }
      });
  });
