'use strict';

angular.module('smartfrenApp')
  .controller('TaggingTransactionCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Tagging%20Transaction').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:tagging_transaction', $scope);

    $scope.$on('socket:activity:modul:tagging_transaction', function(env, data){

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
      order: 'tagging_code',
      limit: 10,
      page: 1
    };
    $scope.columns = [
    {
      descendFirst: true,
      name: 'Tagging Code',
      orderBy: 'tagging_code'
    },
    {
      name: 'Level 1',
      orderBy: 'level_1'
    }
    ];

    getTaggingTransaction(angular.extend({}, $scope.query));

    function getTaggingTransaction(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/tagging_transactions/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/tagging_transactions/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (taggingtransactions) {

        $scope.taggingtransactions = taggingtransactions.data[0].data_taggingtransaction;
        $scope.taggingtransactions.count = taggingtransactions.data[0].count;
        $scope.row_count = taggingtransactions.data[0].count;

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getTaggingTransaction(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.tagging_transaction_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getTaggingTransaction(angular.extend({}, $scope.query, {order: order}));
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
        getTaggingTransaction(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/tagging_transaction');

    }

    $scope.edit = function(id){

        $location.path('/tagging_transaction/edit/'+id);

    }
    $scope.add_new = function(){

       $location.path('/tagging_transaction/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(taggingtransactions){

        $scope.showConfirmDA(taggingtransactions);

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

                $http.delete('/api/tagging_transactions/'+id+'/'+currentUser.nik).then(function (res) {

                    getTaggingTransaction(angular.extend({}, $scope.query));

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
    $scope.showConfirmDA = function(taggingtransactions) {

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
                    url: '/api/tagging_transactions/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: taggingtransactions
                })
                .then(function(response) {

                    getTaggingTransaction(angular.extend({}, $scope.query));
                    
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
  .controller('TaggingTransactionEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Tagging%20Transaction').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:tagging_transaction', $scope);

    $scope.$on('socket:activity:modul:tagging_transaction', function(env, data){

      $scope.activities = data;

    });

    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){

      $http.get('/api/tagging_transactions/show/'+$scope.param).then(function (taggingtransaction) {

        $scope.taggingtransaction = taggingtransaction.data;

      },function(data) {

        $location.path('/tagging_transaction');

      });

      $scope.update_taggingtransaction = function(form) {
          $scope.progress();
          $scope.taggingtransaction.id = $scope.param;
          $scope.taggingtransaction.user_op = currentUser.nik;

          $http({
              url: '/api/tagging_transactions/update',
              method: "POST",
              data: $scope.taggingtransaction
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

        $location.path('/tagging_transaction');

    }
  })
  .controller('TaggingTransactionAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      var currentUser = Auth.getCurrentUser();
    
      $http.get('/api/user_activities/modul/Tagging%20Transaction').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:tagging_transaction', $scope);

      $scope.$on('socket:activity:modul:tagging_transaction', function(env, data){

        $scope.activities = data;

      });
      $scope.add_taggingtransaction = function(form) {
          $scope.progress();
          $scope.taggingtransaction.user_op = currentUser.nik;
          $http({
              url: '/api/tagging_transactions',
              method: "POST",
              data: $scope.taggingtransaction
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
                  window.location.href='/tagging_transaction';
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
        controller: 'TaggingTransactionCtrl',
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

        $location.path('/tagging_transaction');

    }
  });
