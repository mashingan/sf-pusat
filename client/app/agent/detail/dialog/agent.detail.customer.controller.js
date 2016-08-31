/**
 * Created by dwiargo on 5/29/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('AgentDetailCustomerCtrl',function($scope, $mdDialog, DialogValue){
    $scope.set = DialogValue.body.set || {};
    $scope.type_of_services = DialogValue.body.type_of_service;

    //DIALOG
    $scope.cancel = function(){
      $mdDialog.cancel();
    };

    $scope.submit = function(){
      $mdDialog.hide($scope.set);
    }
    //##
  })
