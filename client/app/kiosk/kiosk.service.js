/**
 * Created by dwiargo on 5/6/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('KioskService',function($http){
    return {
      newCustomer:function(data){
        return $http({
          method:'post',
          url:'api/cst_tickets/kiosk_new_customer',
          data:data
        })
      },
      regQrcode:function(data){
        return $http({
          method:'post',
          url:'api/cst_tickets/kiosk_bookcode',
          data:data
        })
      },
      checkMdn:function(data){
        return $http({
          method:'post',
          url:'/api/customers/mdn',
          //url:'assets/dummy/mdn.json',
          data:data
        })
      }
    }
  })
