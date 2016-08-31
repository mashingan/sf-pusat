'use strict';

angular.module('smartfrenApp')
  .controller('TypeOfBreaktimeCtrl', function ($scope, socket, $http, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Type%20Of%20Breaktime').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:type_of_breaktime', $scope);

    $scope.$on('socket:activity:modul:type_of_breaktime', function(env, data){

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

    getCities(angular.extend({}, $scope.query));

    function getCities(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/cities/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/cities/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (cities) {

        $scope.cities = cities.data[0].data_city;
        $scope.cities.count = cities.data[0].count;
        $scope.row_count = cities.data[0].count;


      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getCities(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.city_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getCities(angular.extend({}, $scope.query, {order: order}));
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
        getCities(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/city');

    }

    $scope.edit = function(id){

        $location.path('/city/edit/'+id);

    }
    $scope.add_new = function(){

        $location.path('/city/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(cities){

        $scope.showConfirmDA(cities);

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

                $http.delete('/api/cities/'+id+'/'+currentUser.nik).then(function (res) {

                    getCities(angular.extend({}, $scope.query));
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
    $scope.showConfirmDA = function(cities) {

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
                    url: '/api/cities/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: cities
                })
                .then(function(response) {

                    getCities(angular.extend({}, $scope.query));
                    
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

                    getCities(angular.extend({}, $scope.query));

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
  .controller('CityEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/City').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:city', $scope);

    $scope.$on('socket:activity:modul:city', function(env, data){

      $scope.activities = data;

    });

    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){


      $http.get('/api/provinces/0/1/-name/-').then(function (province) {

        $scope.provinces = province.data.data;

      });
      
      $http.get('/api/cities/show/'+$scope.param).then(function (city) {

        $scope.city = city.data;

      },function(data) {

        $location.path('/city');

      });

      $scope.update_city = function(form) {
          $scope.progress();
          $scope.city.id = $scope.param;
          $scope.city.user_op = currentUser.nik;
          $http({
              url: '/api/cities/update/',
              method: "POST",
              data: $scope.city
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

       $location.path('/city');

    }
  })
  .controller('CityAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

      var currentUser = Auth.getCurrentUser();

      $http.get('/api/user_activities/modul/City').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:city', $scope);

      $scope.$on('socket:activity:modul:city', function(env, data){

        $scope.activities = data;

      });

      $http.get('/api/provinces/0/1/-name/-').then(function (province) {

        $scope.provinces = province.data.data;

      });

      $scope.add_city = function(form) {
          $scope.progress();
          $scope.city.user_op = currentUser.nik;
          $http({
              url: '/api/cities',
              method: "POST",
              data: $scope.city
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
                  $location.path('/city');
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

        $location.path('/city');

    }
  });
