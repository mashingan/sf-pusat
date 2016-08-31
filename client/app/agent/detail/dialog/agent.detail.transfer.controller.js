/**
 * Created by dwiargo on 5/11/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('AgentDetailTransferCtrl',function($scope, $mdDialog,$stateParams, DialogValue,AgentDetailService, RequestHandler, Dialog){
    $scope.current_customer = DialogValue.body.current_customer;
    $scope.gallery = DialogValue.body.gallery;

    //INIT
    function init(){
      $scope.set = {
        from_counter:$scope.gallery.counter,
        gallery:$scope.gallery.name,
        queueing_number:$scope.current_customer.queueing_number,
        customer:$scope.current_customer.customer
      };
      getOnlineCounter();
    }

    function getOnlineCounter(){
      AgentDetailService.onlineCounter($scope.gallery.name,$scope.gallery.counter).then(function(response){
        $scope.onlineCounter = response.data.counters.filter(function(d){return d != $scope.gallery.counter});
        console.log(response)
      },RequestHandler.onError)
    }

    init()
    //##

    //DIALOG HANDLER
    $scope.cancel = function(){
      $mdDialog.cancel();
    };

    $scope.submit = function(){
      $mdDialog.hide($scope.set);
    };
    //##
  })
