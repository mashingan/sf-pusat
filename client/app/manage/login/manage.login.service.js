/**
 * Created by dwiargo on 3/10/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('AdminLogin',function(Http){
    return {
      getCounter:function(){
        return Http.request({
          method:'get',
          url:'assets/dummy/counter.json'
        })
      }
    }
  })
