/**
 * Created by dwiargo on 3/11/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('TimeCtrl',function($scope,$interval){
    var self = this;


    //INIT
    function init(){
      $interval(function(){
        getTime();
      },1000)
      getTime();
    }

    function getTime(){
      $scope.clock = moment(new Date()).format('LTS');
      $scope.date = moment().format('ll');
    }

    init();
    //##

    //PUBLIC
    self.init = init;
  })
