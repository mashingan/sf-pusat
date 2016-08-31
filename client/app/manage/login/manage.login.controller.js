'use strict';

angular.module('smartfrenApp')
  .controller('ManageLoginCtrl', function ($scope,$mdToast, $state, $http, Auth,$mdDialog, $location) {

    $scope.user = {};
    $scope.errors = {};
    $scope.logos = 'assets/images/logo-white.png';

    if(Auth.isLoggedIn()){
      $location.path('/');
    }
    
    $scope.login = function(form) {
      $scope.submitted = true;
      $scope.progress();
      if(form.$valid) {
        Auth.login({
          nik: $scope.user.nik,
          password: $scope.user.password
        })
        .then( function() {
          $mdDialog.hide();
          // Logged in, redirect to home
          $http.get('/api/users/me').then(function (user) {

              if(user.data.role == "CSR"){
                $mdToast.show({
                  position: "top left right",
                  template: "<md-toast>Access denied ! Your role is CSR!</md-toast>"
                });
                Auth.logout();
                $location.path('/manageLogin');
              }else{
                window.location.href='/admin';
              }

          });
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
    //BACK
    $scope.back = function(){
      $state.go('main')
    }
    //##

  });
