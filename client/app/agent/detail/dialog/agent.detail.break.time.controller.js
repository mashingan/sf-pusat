/**
 * Created by dwiargo on 5/17/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('AgentDetailBreakTimeCtrl',function($scope, $mdDialog, DialogValue, AgentDetailService, RequestHandler){
    $scope.set = DialogValue.body || {};

    //INIT
    function init(){
      loadTypeOfBreakTime();
    }

    function loadTypeOfBreakTime(){
      AgentDetailService.typeOfBreakTime().then(function(response){
        $scope.typeofbreaktime = response.data[0].data_typeofbreaktime;
        console.log(response.data);
      },RequestHandler.onError)
    }

    init();
    //##

    //DIALOG HANDLER
    $scope.cancel = function(){
      $mdDialog.cancel();
    };

    $scope.submit = function(){
      $mdDialog.hide($scope.set);
    }
    //##
  })
