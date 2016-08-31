'use strict';

angular.module('smartfrenApp')
  .controller('LoginCtrl', function ($scope,$mdToast, Auth,$mdDialog, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;
      $scope.progress();
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          $mdDialog.hide();
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $mdDialog.hide();
          $mdToast.show({
            position: "top left right",
            template: "<md-toast>" + err.message + "</md-toast>"
          });
        });
      }
    };
    $scope.progress = function(){
      $mdDialog.show({
        controller: 'LoginCtrl',
        template: '<md-dialog style="background-color:transparent;box-shadow:none">' +
                    '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                        '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                    '</div>' +
                 '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false
      })
      .then(function(answer) {

      });
    }
  });
