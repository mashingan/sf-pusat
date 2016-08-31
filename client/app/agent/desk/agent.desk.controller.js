'use strict';

angular.module('smartfrenApp')
  .controller('AgentDeskCtrl', function ($scope, $state, $mdDialog) {
    //HANDLE
    $scope.go = function(param){
      $state.go('agentDetail',{id:'1',counter:'12',desk:param.desk})
      $mdDialog.cancel();
    }
    $scope.cancel = function(){
      $mdDialog.cancel();
    }
    //##
  });
