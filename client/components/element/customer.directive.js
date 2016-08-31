/**
 * Created by dwiargo on 3/11/16.
 */

'use strict';

angular.module('smartfrenApp')
  .directive('customerQueue',function(){
    return{
      restrict:'E',
      replace:true,
      templateUrl:'/components/element/customer.queue.html',
      scope:{
        data:'='
      },
      link:function(scope,element,attrs){

      }
    }
  })
