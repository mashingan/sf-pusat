'use strict';

angular.module('smartfrenApp')
  .controller('TypeofserviceCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Type%20Of%20Service').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:type_of_service', $scope);

    $scope.$on('socket:activity:modul:type_of_service', function(env, data){

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
    },
    {
      name: 'Description',
      orderBy: 'description'
    }
    ];

    getServices(angular.extend({}, $scope.query));

    function getServices(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/typeofservices/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/typeofservices/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (typeofservices) {

        $scope.typeofservices = typeofservices.data[0].data_typeofservice;
        $scope.typeofservices.count = typeofservices.data[0].count;
        $scope.row_count = typeofservices.data[0].count;
        console.log(typeofservices);

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getServices(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.typeofservice_id = item._id;
      console.log(item);

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getServices(angular.extend({}, $scope.query, {order: order}));
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
        getServices(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/typeofservice');

    }

    $scope.edit = function(id){

        $location.path('/typeofservice/edit/'+id);

    }
    $scope.add_new = function(){

        $location.path('/typeofservice/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(typeofservices){

        $scope.showConfirmDA(typeofservices);


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

                $http.delete('/api/typeofservices/'+id+'/'+currentUser.nik).then(function (res) {

                    getServices(angular.extend({}, $scope.query));
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
    $scope.showConfirmDA = function(typeofservices) {

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
                    url: '/api/typeofservices/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: typeofservices
                })
                .then(function(response) {

                    getServices(angular.extend({}, $scope.query));
                    
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

                    getUsers(angular.extend({}, $scope.query));

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
  .controller('TypeofserviceEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Type%20Of%20Service').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:type_of_service', $scope);

    $scope.$on('socket:activity:modul:type_of_service', function(env, data){

      $scope.activities = data;

    });
    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){

      $http.get('/api/typeofservices/show/'+$scope.param).then(function (typeofservice) {

        $scope.typeofservice = typeofservice.data;

      },function(data) {

        $location.path('/typeofservice');

      });

      $scope.update_typeofservice = function(form) {
          $scope.progress();
          $scope.typeofservice.id = $scope.param;
          $scope.typeofservice.user_op = currentUser.nik;

          $http({
              url: '/api/typeofservices/update',
              method: "POST",
              data: $scope.typeofservice
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

        $location.path('/typeofservice');

    }
  })
  .controller('TypeofserviceAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      var currentUser = Auth.getCurrentUser();
    
      $http.get('/api/user_activities/modul/Type%20Of%20Service').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:type_of_service', $scope);

      $scope.$on('socket:activity:modul:type_of_service', function(env, data){

        $scope.activities = data;

      });
      $scope.add_typeofservice = function(form) {
          $scope.progress();
          $scope.typeofservice.user_op = currentUser.nik;
          $http({
              url: '/api/typeofservices',
              method: "POST",
              data: $scope.typeofservice
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
                  $location.path('/typeofservice');
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

        $location.path('/typeofservice');

    }
  });
