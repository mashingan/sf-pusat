'use strict';

angular.module('smartfrenApp')
  .controller('AdminCtrl', function ($scope, $http, Auth,socket) {

    var currentUser = Auth.getCurrentUser();

    $scope.format = 'hh:mm:ss a';
    $scope.led = 'rgba(139,195,74 ,1)';
    $scope.server_status = 'SERVER CONNECTED';
    $scope.extra_status = 'socket : on';
    $scope.current_date = moment().format('DD-MM-YYYY');

    $http.get('/api/user_activities').then(function (ua) {

        $scope.activities = ua.data;

    });

    $http.get('/api/galleries/gallery/open').then(function (galleries) {

        $scope.galleries = galleries.data;

    });

    $http.get('/api/users/status/online').then(function (users) {

        $scope.online_users = users.data;

    });

    $http.get('/api/galleries/gallery_stat/count').then(function (data) {

        $scope.gallery_stat_count = data.data.count;

    });

    $http.get('/api/customers/customer_stat/count').then(function (data) {

        $scope.customer_stat_count = data.data.count;

    });

    $http.get('/api/cst_tickets/ticket_stat/count').then(function (data) {

        $scope.book_stat_count = data.data.count;

    });

    $http.get('/api/cst_tickets/transaction_stat/count').then(function (data) {

        $scope.transaction_stat_count = data.data.count;

    });

    $scope.$on('socket:error', function (ev, data) {
   
    });

    socket.forward('connect', $scope);
    socket.forward('disconnect', $scope);
    socket.forward('activity:user', $scope);
    socket.forward('user:online', $scope);
    socket.forward('gallery:online', $scope);
    socket.forward('stat:gallery:count', $scope);
    socket.forward('stat:customer:count', $scope);
    socket.forward('stat:book:count', $scope);
    
    $scope.$on('socket:connect', function (ev, data) {
        

        $scope.led = 'rgba(139,195,74 ,1)';
        $scope.server_status = 'SERVER CONNECTED';
        $scope.extra_status = 'socket : on';
        
    
    });

    $scope.$on('socket:activity:user', function(ev, data){

      $scope.activities = data;

    });

    $scope.$on('socket:user:online', function(ev, data){

      $scope.online_users = data;

    });

    $scope.$on('socket:gallery:online', function(ev, data){

      $scope.galleries = data;

    });
    
    $scope.$on('socket:stat:gallery:count', function(ev, data){

      $scope.gallery_stat_count = data;

    });

    $scope.$on('socket:stat:customer:count', function(ev, data){

      $scope.customer_stat_count = data;

    });

    $scope.$on('socket:stat:book:count', function(ev, data){

      $scope.book_stat_count = data;

    });


    $scope.$on('socket:disconnect', function(){

        $scope.led = 'rgba(158,158,158 ,1)';
        $scope.extra_status = 'Try to reconnect...';
        $scope.server_status = 'SERVER DISCONNECTED';
        
    });

    var day_of_week = 7;
    
    $scope.series_date = [];
    $scope.series_date_post = [];

    $scope.series_date_2 = [];
    $scope.series_date_post_2 = [];

    for(var i = 1; i < (day_of_week+1); i++){

        $scope.series_date.push(moment().subtract(i, 'day').format('DD'));
        $scope.series_date_post.push(moment().subtract(i, 'day').format('YYYY-MM-DD'));
        $scope.series_date_2.push(moment().subtract(i, 'day').format('DD'));
        $scope.series_date_post_2.push(moment().subtract(i, 'day').format('YYYY-MM-DD'));

    }

    $http({
          url: '/api/cst_tickets/queueing_chart',
          method: "POST",
          data: { dates : $scope.series_date_post}
      })
      .then(function(data) {

            $scope.done_transaction = data.data.series_done_transaction;
            $scope.unserviced_transaction = data.data.series_unserviced_transaction;
            $scope.total_transaction = data.data.series_total_transaction;
        
            $scope.chart1Config = {
                exporting: {
                    chartOptions: { 
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        }
                    },
                    scale: 3,
                    fallbackToExportServer: false
                },

                options: {
                    chart: {
                        type: 'line'
                    }
                },
                xAxis: {
                    categories: $scope.series_date.reverse()
                },
                series: [{
                    name: 'Terlayani',
                    data: $scope.done_transaction.reverse()
                },
                {
                    name: 'Tidak Terlayani',
                    data: $scope.unserviced_transaction.reverse()
                },
                {
                    name: 'Total Antrian',
                    data: $scope.total_transaction.reverse()
                }],
                title: {
                    text: 'Queueing Line Chart'
                },

                loading: false
            }
      });
    
    $http({
          url: '/api/cst_tickets/customer_chart',
          method: "POST",
          data: { dates : $scope.series_date_post_2}
      })
      .then(function(data) {

            $scope.mobile_customer = data.data.series_mobile_customer;
            $scope.regular_customer = data.data.series_regular_customer;
            $scope.total_transaction = data.data.series_total_transaction;
        
            $scope.chart2Config = {
            exporting: {
                chartOptions: { 
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                },
                scale: 3,
                fallbackToExportServer: false
            },

            options: {
                chart: {
                    type: 'bar'
                }
            },
            xAxis: {
                categories: $scope.series_date_2.reverse()
            },
            series: [{
                name: 'Customer Booking',
                data: $scope.mobile_customer.reverse()
            },
            {
                name: 'Customer Langsung ke Gallery',
                data: $scope.regular_customer.reverse() 
            },
            {
                name: 'Total Antrian',
                data: $scope.total_transaction.reverse()
            }],
            title: {
                text: 'Customer Bar Chart'
            },

            loading: false
        }
      });
    
    
  })
.directive('imageFill', [function() {
  return {
    restrict: 'A',
    scope: {
      'model': '='
    },
    link: function(scope, elem, attrs) {
      $(elem).imagefill();
    }
  };
}]);
