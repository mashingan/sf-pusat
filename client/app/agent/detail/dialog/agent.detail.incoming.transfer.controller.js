/**
 * Created by dwiargo on 5/16/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('AgentDetailIncomingTransferCtrl',function($scope, $mdDialog, DialogValue, AgentDetailService){
    $scope.incoming_transfer_customer = DialogValue.body;
    //DIALOG HANDLER
    $scope.cancel = function(){
      $mdDialog.cancel();
    };

    $scope.submit = function(item){
      $mdDialog.hide(item);
    }
    //##
  })
