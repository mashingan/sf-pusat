/**
 * Created by dwiargo on 3/11/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('AgentDetailService',function($http){
    return{
      queryMDN:function(mdn){

      },
      recall:function(currentCustomer){
        return $http({
          url: '/api/cst_tickets/agent_recall_customer',
          method: "POST",
          data: { customer_ticket_id : currentCustomer.id }
        })
      },
      next:function(currentCustomer){
        return $http({
          url: '/api/cst_tickets/agent_next_customer',
          method: "POST",
          data: { customer_ticket_id : currentCustomer.id }
        })
      },
      noShow:function(currentCustomer){
        return $http({
          url: '/api/cst_tickets/agent_noshow_customer',
          method: "POST",
          data: { customer_ticket_id : currentCustomer.id }
        })
      },
      transfer:function(data){
        return $http({
          url: '/api/transfer_customers/save',
          method: "POST",
          data: data
        })
      },
      breakTime:function(){

      },
      close:function(data){
        return $http({
          url: '/api/customer_tagging_transactions/closed',
          method: 'POST',
          data: data
        })
      },
      nextTransaction:function(data){
        return $http({
          url: '/api/customer_tagging_transactions/save',
          method: "POST",
          data: data
        })
      },
      repeat:function(currentCustomer){
        return $http({
          url: '/api/cst_tickets/agent_repeat_customer',
          method: "POST",
          data: { customer_ticket_id : currentCustomer.id }
        })
      },
      currentCustomer:function(galleryName,counter,date){
        return $http({
          url: '/api/cst_tickets/agent_current_customer',
          method: 'POST',
          data: { gallery : galleryName, counter: counter, date: date}
        })
      },
      taggingTransaction:function(taggingCode){
        return $http({
          url: '/api/tagging_transactions/tagging_code',
          method: "POST",
          data: { tagging_code : taggingCode }
        })
      },
      save:function(data){
        return $http({
          url: '/api/customer_tagging_transactions/save',
          method: "POST",
          data: data
        })
      },
      onlineCounter:function(galleryName,counter){
        return $http({
          url: '/api/users/online_csr',
          method: 'POST',
          data: { gallery : galleryName, counter: counter}
        })
      },
      doTransfer:function(data){
        $http({
          url: '/api/transfer_customers/save',
          method: 'POST',
          data: data
        })
      },
      call:function(galleryId,counter){
        return $http({
          url: '/api/cst_tickets/agent_call_customer',
          method: 'POST',
          data: { gallery : galleryId, counter: counter }
        })
      },
      waiting:function(){
        return $http({
          method:'get',
          url:'/api/cst_tickets/agent_waiting_list'
        })
      },
      typeOfBreakTime:function(){
        return $http({
          method:'get',
          url:'/api/typeofbreaktimes/query/0/1/-name/-'
        })
      },
      breakTime:function(data){
        return $http({
          method:'post',
          url:'api/agent_breaktimes',
          data:data
        })
      },
      updateBreakTime:function(data){
        return $http({
          method:'post',
          url:'api/agent_breaktimes/update',
          data:data
        })
      }
    }
  })
