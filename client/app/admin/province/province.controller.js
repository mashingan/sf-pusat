'use strict';

angular.module('smartfrenApp')
  .controller('ProvinceCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Province').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:province', $scope);

    $scope.$on('socket:activity:modul:province', function(env, data){

      $scope.activities = data;

    });
    $scope.selected = [];
    $scope.selected_id = [];
    $scope.filter = {
        options: {
            debounce: 500
        }
    };
    $scope.query = {
      filter: '',
      order: 'name',
      limit: 10,
      page: 1
    };
    $scope.columns = [
    {
      descendFirst: true,
      name: 'Name',
      orderBy: 'name'
    }
    ];

    getProvinces(angular.extend({}, $scope.query));

    function getProvinces(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/provinces/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/provinces/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (provinces) {

        $scope.provinces = provinces.data[0].data_province;
        $scope.provinces.count = provinces.data[0].count;
        $scope.row_count = provinces.data[0].count;

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getProvinces(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.province_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getProvinces(angular.extend({}, $scope.query, {order: order}));
      }, 500);

    };

    $scope.removeFilter = function() {
        $scope.filter.show = false;
        $scope.query.filter = '';

        if ($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
        }
    };

    $scope.$watch('query.filter', function(newValue, oldValue) {
        if (!oldValue) {
            bookmark = $scope.query.page;
        }

        if (newValue !== oldValue) {
            $scope.query.page = 1;
        }

        if (!newValue) {
            $scope.query.page = bookmark;
        }
        $scope.query.filter = newValue;
        getProvinces(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/province');

    }

    $scope.edit = function(id){

        $location.path('/province/edit/'+id);

    }
    $scope.add_new = function(){


        $location.path('/province/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(provinces){

        $scope.showConfirmDA(provinces);

    }
    $scope.showConfirm = function(id) {

      var confirm = $mdDialog.confirm()
            .title('Confirm')
            .textContent('Are you sure?')
            .ariaLabel('Confirm')
            .ok('Yes')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.selected = [];
              $scope.promise = $timeout(function () {

                $http.delete('/api/provinces/'+id+'/'+currentUser.nik).then(function (res) {

                    getProvinces(angular.extend({}, $scope.query));
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Response Server')
                        .textContent('Data successfully deleted!')
                        .ariaLabel('Response')
                        .ok('Ok!')
                    )
                    .then(function() {
                       
                    });    

                });

              }, 500);

      }, function() {
          $mdDialog.show(
          $mdDialog.alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title('Response Server')
              .textContent('Oop! There is something wrong!')
              .ariaLabel('Response')
              .ok('Ok!')
          )
          .then(function(answer) {

          });
      });

    };
    $scope.showConfirmDA = function(provinces) {

      var confirm = $mdDialog.confirm()
            .title('Confirm')
            .textContent('Are you sure want to delete all selected rows?')
            .ariaLabel('Confirm')
            .ok('Yes')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              $scope.selected = [];
              $scope.promise = $timeout(function () {

                $http({
                    url: '/api/provinces/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: provinces
                })
                .then(function(response) {

                    getProvinces(angular.extend({}, $scope.query));
                    
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Response Server')
                        .textContent('Data successfully deleted!')
                        .ariaLabel('Response')
                        .ok('Ok!')
                    )
                    .then(function() {
                       
                    });    

                },
                function(response) { // optional

                    $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Response Server')
                        .textContent('Oop! There is something wrong!')
                        .ariaLabel('Response')
                        .ok('Ok!')
                    )
                    .then(function(answer) {

                    });

                });

              }, 500);

      }, function() {

      });

    };

  })
  .controller('ProvinceEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Province').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:province', $scope);

    $scope.$on('socket:activity:modul:province', function(env, data){

      $scope.activities = data;

    });

    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){

      $http.get('/api/provinces/show/'+$scope.param).then(function (province) {

        $scope.province = province.data;


      },function(data) {

        $location.path('/province');

      });

      $scope.update_province = function(form) {
          $scope.progress();
          $scope.province.id = $scope.param;
          $scope.province.user_op = currentUser.nik;

          $http({
              url: '/api/provinces/update',
              method: "POST",
              data: $scope.province
          })
          .then(function(response) {
                
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .title('Response Server')
                  .textContent('Data successfully updated!')
                  .ariaLabel('Response')
                  .ok('Ok!')
              )
              .then(function(answer) {

              });

          },
          function(response) { // optional
                
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .title('Response Server')
                  .textContent('Oop! There is something wrong!')
                  .ariaLabel('Response')
                  .ok('Ok!')
              )
              .then(function(answer) {

              });

          });
      }
    }
    $scope.progress = function(){
      $mdDialog.show({
        controller: 'UserCtrl',
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
    $scope.redirect_back = function(){

        $location.path('/province');

    }
  })
  .controller('ProvinceAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

      var currentUser = Auth.getCurrentUser();
    
      $http.get('/api/user_activities/modul/Province').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:province', $scope);

      $scope.$on('socket:activity:modul:province', function(env, data){

        $scope.activities = data;

      });

      $scope.add_province = function(form) {
          $scope.progress();
          $scope.province.user_op = currentUser.nik;
          $http({
              url: '/api/provinces',
              method: "POST",
              data: $scope.province
          })
          .then(function(response) {

              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .title('Response Server')
                  .textContent('Data successfully added!')
                  .ariaLabel('Response')
                  .ok('Ok!')
              )
              .then(function() {
                  $location.path('/province');
              });    

          },
          function(response) { // optional
            
             $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .title('Response Server')
                  .textContent('Oop! There is something wrong!')
                  .ariaLabel('Response')
                  .ok('Ok!')
              )
              .then(function(answer) {

              });

          });
      }

    $scope.progress = function(){
      $mdDialog.show({
        controller: 'TypeofserviceCtrl',
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
    $scope.redirect_back = function(){

        $location.path('/province');

    }
  });
