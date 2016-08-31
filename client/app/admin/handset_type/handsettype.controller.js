'use strict';

angular.module('smartfrenApp')
  .controller('HandsettypeCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Handset%20Type').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:handset_type', $scope);

    $scope.$on('socket:activity:modul:handset_type', function(env, data){

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

    getHandsettype(angular.extend({}, $scope.query));

    function getHandsettype(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/handset_types/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/handset_types/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (handsettypes) {

        $scope.handsettypes = handsettypes.data[0].data_handsettype;
        $scope.handsettypes.count = handsettypes.data[0].count;
        $scope.row_count = handsettypes.data[0].count;

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getHandsettype(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.handsettype_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getHandsettype(angular.extend({}, $scope.query, {order: order}));
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
        getHandsettype(angular.extend({}, $scope.query));
    });

    

    $scope.edit = function(id){

        $location.path('/handsettype/edit/'+id);
    }
    $scope.add_new = function(){

        $location.path('/handsettype/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(handsettypes){

        $scope.showConfirmDA(handsettypes);

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

                $http.delete('/api/handset_types/'+id+'/'+currentUser.nik).then(function (res) {
                    
                    getHandsettype(angular.extend({}, $scope.query));

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
    $scope.showConfirmDA = function(handsettypes) {

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
                    url: '/api/handset_types/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: handsettypes
                })
                .then(function(response) {
                    
                    getHandsettype(angular.extend({}, $scope.query));

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
  .controller('HandsettypeEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Handset%20Type').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:handset_type', $scope);

    $scope.$on('socket:activity:modul:handset_type', function(env, data){

      $scope.activities = data;

    });
    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){

      $http.get('/api/handset_types/show/'+$scope.param).then(function (handsettype) {

        $scope.handsettype = handsettype.data;

      },function(data) {

        $location.path('/handsettype');

      });

      $scope.update_handsettype = function(form) {
          $scope.progress();
          $scope.handsettype.id = $scope.param;
          $scope.handsettype.user_op = currentUser.nik;

          $http({
              url: '/api/handset_types/update',
              method: "POST",
              data: $scope.handsettype
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

        window.location.href='/handsettype';

    }
  })
  .controller('HandsettypeAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      var currentUser = Auth.getCurrentUser();
    
      $http.get('/api/user_activities/modul/Handset%20Type').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:handset_type', $scope);

      $scope.$on('socket:activity:modul:handset_type', function(env, data){

        $scope.activities = data;

      });

      $scope.add_handsettype = function(form) {
          $scope.progress();
          $scope.handsettype.user_op = currentUser.nik;
          $http({
              url: '/api/handset_types',
              method: "POST",
              data: $scope.handsettype
          })
          .then(function(response) {
            
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Response Server')
                .textContent('Data successfully Added!')
                .ariaLabel('Response')
                .ok('Ok!')
            )
            .then(function() {

              $location.path('/handsettype');
            
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

        $location.path('/handsettype');

    }
  });
