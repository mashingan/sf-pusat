/**
 * Created by dwiargo on 3/7/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('MainService',function(Http){
    return {
      module:{
        get:function(){
          return Http.request({
            method:'get',
            url:'/assets/dummy/module.json'
          })
        }
      }
    }
  })
