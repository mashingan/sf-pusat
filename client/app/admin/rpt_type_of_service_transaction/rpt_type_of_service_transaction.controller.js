'use strict';

angular.module('smartfrenApp')
  .controller('RptTypeOfServiceTransactionCtrl', function ($scope, socket, $http, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    $scope.selected = [];
    $scope.selected_id = [];
    $scope.filter = {
        options: {
            debounce: 500
        }
    };
    $scope.query = {
      filter: '',
      order: 'date',
      limit: 10,
      page: 1
    };
    $scope.columns = [
    {
      descendFirst: true,
      name: 'date',
      orderBy: 'date'
    }
    ];
    $http.get('/api/typeofservices/-').then(function(typeofservices){

      $scope.typeofservices = typeofservices.data;

    });
    
    getRptTypeOfServiceTransaction(angular.extend({}, $scope.query));

    function getRptTypeOfServiceTransaction(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/cst_tickets/rpt_type_of_service_transaction/'+limit+'/'+page+'/'+order;
      }else{
        api_uri = '/api/cst_tickets/rpt_type_of_service_transaction/'+limit+'/'+page+'/'+order;
      }

      $http.get(api_uri).then(function (transaction_data) {

        $scope.transaction_report = transaction_data.data[0].data_type_of_service_transaction;
        $scope.transaction_report.count = transaction_data.data[0].count;
        $scope.row_count = transaction_data.data[0].count;


      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getRptTypeOfServiceTransaction(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };


    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getRptTypeOfServiceTransaction(angular.extend({}, $scope.query, {order: order}));
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
        getRptTypeOfServiceTransaction(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/rpt_type_of_service_transaction');

    }

  });
