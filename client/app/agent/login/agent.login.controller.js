'use strict';

angular.module('smartfrenApp')
  .controller('AgentLoginCtrl', function ($scope, $state, $stateParams, $http, AgentLogin, RequestHandler, Dialog, Auth, GalleriesService) {
    $scope.message = 'Hello';
    $scope.user = {counter: ""};
    $scope.logos = 'assets/images/logo-white.png';
    $scope.counter = [];

    var galleries = {}

    //INIT
    function init() {
      Auth.logout();
      loadGallery();
    }

    function loadGallery() {
      GalleriesService.list().then(function(response){
        var result = response.data.data;
        for(var i = 0 ; i < result.length ; i ++){
          galleries[result[i].name] = result[i];
        }
      })
    }

    init();
    //##

    //LOGIN
    $scope.login = function () {
      Auth.login({
        nik: $scope.user.nik,
        password: $scope.user.password
      }).then(function (response) {
        $http.get('/api/users/me').then(function (user){
          if (user.data.role != 'CSR') {
            Dialog.showToast({message: 'Access Denied. Your role is not CSR !'})
          } else {

            $http({
                  url: '/api/galleries/gallery/set_open',
                  method: "POST",
                  data: { gallery : user.data.role_item[0].value }
            }).then(function(){

              $state.go('agentDetail', {
                id: user.data._id,
                counter: user.data.role_item[1].value,
                galleryName: user.data.role_item[0].value,
                galleryId:galleries[user.data.role_item[0].value].id
              });

            });

          }
        })
      }).catch( function(err) {
          Dialog.showToast({message: err.message})
        });
    };
    //##

    //BACK
    $scope.back = function(){
      $state.go('main')
    }
    //##
  });
