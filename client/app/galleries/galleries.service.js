/**
 * Created by dwiargo on 4/18/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('GalleriesService', function ($http) {
    return {
      list: function () {
        return $http({
          method: 'GET',
          url: '/api/galleries/0/1/-name/-',
          //url:'/assets/dummy/gallery.json',
          params: {
            limit: 0,
            page: 1,
            order: '-name',
            filter: '-'
          }
        })
      },
      get:function(id){
        return $http({
          method:'get',
          url:'/api/galleries/'+id
        })
      }
    }
  })
