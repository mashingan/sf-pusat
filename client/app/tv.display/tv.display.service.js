/**
 * Created by dwiargo on 4/18/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('TvDisplayService', function ($http, Global) {
    return {
      counterList: function (galleryName,date) {
        return $http({
          url: '/api/cst_tickets/tv_display_counter_list',
          data: {
            gallery:galleryName,
            date:date
          },
          method: 'post'
        })
      },
      waitingList: function (galleryName,date) {
        return $http({
          url: 'api/cst_tickets/tv_display_queue_list',
          method: 'post',
          data:{
            gallery:galleryName,
            date:date
          }
        })
      },
      runningText: function () {
        return $http({
          method: 'get',
          url: '/api/galleries/socket_test/data',
        })
      }
    }
  })
