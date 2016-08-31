/**
 * Created by dwiargo on 3/8/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('KioskRegisterCtrl',function($scope, $mdDialog, DialogValue){
    $scope.set = DialogValue.body || {};
    $scope.newCustomer = DialogValue.body.newCustomer;

    //SUBMIT
    $scope.submit = function(){
      delete $scope.set.newCustomer;
      $mdDialog.hide($scope.set);
    }
    //##

    //CANCEL
    $scope.cancel = function(){
      $mdDialog.cancel();
    }
    //##
  })
