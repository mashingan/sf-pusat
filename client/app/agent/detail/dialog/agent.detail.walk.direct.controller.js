/**
 * Created by dwiargo on 5/12/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('AgentDetailWalkDirectCtrl',function($scope, $mdDialog, DialogValue, AgentDetailService){

    //DIALOG HANDLER
    $scope.cancel = function(){
      $mdDialog.cancel();
    };

    $scope.submit = function(){
      $mdDialog.hide($scope.set);
    }
    //##
  })
