'use strict';

angular.module('smartfrenApp')
  .controller('SocketCtrl', function ($scope, $interval, socket, $http, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

    var gallery_id = '5729e192858f17130e6c8765';
    var gallery_name = 'Gallery BEC';
    var counter = 1;
    var date = moment('2016-05-13').format("YYYY-MM-DD");
    var CSR = 'Tsubasa Honda';
    var timer;

    
    $scope.socket_status = "DISCONNECT";
    $scope.current_customer = {};
    $scope.transaction_duration = "00:00";
    $scope.online_counters = [];
    $scope.transfer_counter = "";
    $scope.transfer_note = "";
    $scope.reg_customer = "";
    
    $http.get('/api/typeofservices/-').then(function(typeofservices){

        $scope.typeofservices = typeofservices.data;

    });

    $http.get('/api/galleries/'+gallery_id).then(function(gallery){

        $scope.counters = gallery.data.counter_count;

        for(var i = 0; i < $scope.counters;i++){

          socket.forward('agent:current_customer:'+gallery_id+':'+(i+1), $scope); 
          $scope.$on('socket:agent:current_customer:'+gallery_id+':'+(i+1), function(env, data){

            if($scope.current_customer.id != data.id){

              var confirm = $mdDialog.confirm()
                .title('Attention !')
                .textContent(data.customer + ', Antrian No. ' + data.queueing_number + ' ke Counter ' + data.counter)
                .ariaLabel('response')
                .ok('OK')

              $mdDialog.show(confirm)

            }

            $scope.current_customer = data;


          });
  
        }


    });

    $scope.register = function(){

      $http({
          url: '/api/cst_tickets/kiosk_new_customer',
          method: "POST",
          data: { gallery : gallery_name, name: $scope.reg_customer, type_of_service: $scope.type_of_service}
      }).then(function(){

          $scope.reg_customer = "";
          $scope.type_of_service = "";

      });

    }

    /* example socket tv display - running text */

    /* init running text */
    $http.get('/api/galleries/socket_test/data').then(function (gallery) {

      $scope.running_text = gallery.data.running_text;

    });

    $http.get('/api/cst_tickets/agent_waiting_list').then(function (waiting_list) {

      $scope.agent_waiting_list = waiting_list.data.data;

    });

    /* get others online counters list*/
    $http({
          url: '/api/users/online_csr',
          method: "POST",
          data: { gallery : gallery_name, counter: counter}
      })
      .then(function(response) {

         $scope.online_counters = response.data.counters;

      });

    $http({
          url: '/api/cst_tickets/agent_current_customer',
          method: "POST",
          data: { gallery : gallery_name, counter: counter, date: date}
      })
      .then(function(response) {

         $scope.current_customer = response.data;

      });


    /* example socket tv display - waiting list */

    $http({
          url: '/api/cst_tickets/tv_display_queue_list',
          method: "POST",
          data: { gallery : gallery_name, date: date}
      })
      .then(function(response) {

         $scope.waiting_list = response.data.data;

      });

    /* example socket tv display - counter list */

    $http({
          url: '/api/cst_tickets/tv_display_counter_list',
          method: "POST",
          data: { gallery : gallery_name, date: date}
      })
      .then(function(response) {

         $scope.counter_list = response.data.data;

      });

    socket.forward('connect', $scope);
    socket.forward('tvdisplay:running_text:'+gallery_id, $scope);
    socket.forward('tvdisplay:counter_list:'+gallery_id, $scope);
    socket.forward('tvdisplay:waiting_list:'+gallery_id, $scope);
    socket.forward('agent:incoming_transfer_customer:'+gallery_id+':'+counter, $scope);
    socket.forward('agent:recall_customer:'+gallery_id, $scope);
    socket.forward('agent:waiting_list:'+gallery_id, $scope);

     /* listen on gallery running text channel */
    $scope.$on('socket:connect', function(){

        $scope.socket_status = "CONNECTED";

    });
    $scope.$on('socket:tvdisplay:running_text:'+gallery_id, function(env, data){

      $scope.running_text = data;

    });
    $scope.$on('socket:tvdisplay:counter_list:'+gallery_id, function(env, data){

      $scope.counter_list = data;

    });
    $scope.$on('socket:tvdisplay:waiting_list:'+gallery_id, function(env, data){

      $scope.waiting_list = data;

    });
    $scope.$on('socket:agent:waiting_list:'+gallery_id, function(env, data){

      $scope.agent_waiting_list = data;

    });
    $scope.$on('socket:agent:incoming_transfer_customer:'+gallery_id+':'+counter, function(env, incoming_transfer_customer){

      $scope.incoming_transfer_customer = incoming_transfer_customer.data;

    });
    // $scope.$on('socket:agent:current_customer:'+gallery_id+':'+counter, function(env, data){

    //   if($scope.current_customer.id != data.id){

    //     var confirm = $mdDialog.confirm()
    //       .title('Attention !')
    //       .textContent(data.customer + ', Antrian No. ' + data.queueing_number + ' ke Counter ' + data.counter)
    //       .ariaLabel('response')
    //       .ok('OK')

    //     $mdDialog.show(confirm)

    //   }

    //   $scope.current_customer = data;


    // });
    $scope.$on('socket:agent:recall_customer:'+gallery_id, function(env, data){

      var confirm = $mdDialog.confirm()
        .title('Attention !')
        .textContent(data.customer + ', Antrian No. ' + data.queueing_number + ' ke Counter ' + data.counter)
        .ariaLabel('response')
        .ok('OK')

      $mdDialog.show(confirm)

    });

    /* button control */
    $scope.next = function(){

      $http({
          url: '/api/cst_tickets/agent_next_customer',
          method: "POST",
          data: { customer_ticket_id : $scope.current_customer.id }
      })
      .then(function(response) {

          var confirm = $mdDialog.confirm()
            .title('Response Server')
            .textContent(response.data.message)
            .ariaLabel('response')
            .ok('OK')

          $mdDialog.show(confirm)

      });

    }
    $scope.recall = function(){

      $http({
          url: '/api/cst_tickets/agent_recall_customer',
          method: "POST",
          data: { customer_ticket_id : $scope.current_customer.id }
      }).then(function(response){

        if(response.data.result == "failed"){

          var confirm = $mdDialog.confirm()
          .title('Response Server')
          .textContent(response.data.message)
          .ariaLabel('response')
          .ok('OK')

          $mdDialog.show(confirm)

        }

      });

    }
    $scope.call = function(){

      $http({
          url: '/api/cst_tickets/agent_call_customer',
          method: "POST",
          data: { gallery : gallery_id, counter: counter }
      }).then(function(response){

        if(response.data.result == "failed"){

          var confirm = $mdDialog.confirm()
          .title('Response Server')
          .textContent(response.data.message)
          .ariaLabel('response')
          .ok('OK')

          $mdDialog.show(confirm)

        }

      });

    }
    $scope.no_show = function(){

      $http({
          url: '/api/cst_tickets/agent_noshow_customer',
          method: "POST",
          data: { customer_ticket_id : $scope.current_customer.id }
      }).then(function(response){

        console.log(response);

      });

    }
    $scope.repeat = function(){

      $http({
          url: '/api/cst_tickets/agent_repeat_customer',
          method: "POST",
          data: { customer_ticket_id : $scope.current_customer.id }
      }).then(function(response){

        console.log(response);

      });

    }
    $scope.getTaggingTransaction = function(){

      $http({
          url: '/api/tagging_transactions/tagging_code',
          method: "POST",
          data: { tagging_code : $scope.tagging_code }
      }).then(function(response){

        if(response.data.result == "failed"){

          var confirm = $mdDialog.confirm()
          .title('Response Server')
          .textContent(response.data.message)
          .ariaLabel('response')
          .ok('OK')

          $mdDialog.show(confirm)

        }else{

          $scope.tagging_level_1 = response.data.level_1;
          $scope.tagging_level_2 = response.data.level_2;
          $scope.tagging_level_3 = response.data.level_3;
          $scope.tagging_level_4 = response.data.level_4;
          $scope.sla = response.data.sla;
          
          var duration = moment.duration({
            'seconds': 0,
            'hour': 0,
            'minutes': 0
          });

          var interval = 1;
          var is_alerted = 0;
          timer = $interval(function () {

              duration = moment.duration(duration.asSeconds() + interval, 'seconds');
              $scope.transaction_duration = duration.minutes() + ':' + duration.seconds();
              
              if(duration.minutes() == $scope.sla){
                if(duration.seconds() > 0){

                  if(is_alerted==0){

                    is_alerted = 1;
                    
                    var confirm = $mdDialog.confirm()
                    .title('SLA Alert')
                    .textContent("Durasi Transaksi melebihi SLA!")
                    .ariaLabel('response')
                    .ok('OK')

                    $mdDialog.show(confirm)

                  }
                   
                }
              }

          }, 1000);

        }

      });

    }
    $scope.next_transaction = function(){
      /* set up data */
      var time = moment().format('HH:mm');
      var data = { 
        tagging_code : $scope.tagging_code, 
        customer : $scope.current_customer.customer, 
        agent : CSR, 
        date: date, 
        time: time, 
        counter: counter, 
        gallery: gallery_name, 
        duration : $scope.transaction_duration 
      }

      /* save current transaction */

      $http({
          url: '/api/customer_tagging_transactions/save',
          method: "POST",
          data: data
      }).then(function(response){

        if(response.data.result == "failed"){

          var confirm = $mdDialog.confirm()
          .title('Response Server')
          .textContent(response.data.message)
          .ariaLabel('response')
          .ok('OK')

          $mdDialog.show(confirm)

        }else{

          /* reset tagging transaction */

          $scope.tagging_code = "";
          $scope.tagging_level_1 = "";
          $scope.tagging_level_2 = "";
          $scope.tagging_level_3 = "";
          $scope.tagging_level_4 = "";
          $scope.sla = "";
          $interval.cancel(timer);
          $scope.transaction_duration = "00:00";
        }

      });


    }
    $scope.closed = function(){
      /* set up data */
      var time = moment().format('HH:mm');
      var data = { 
        tagging_code : $scope.tagging_code, 
        customer : $scope.current_customer.customer, 
        agent : CSR, 
        date: date, 
        time: time, 
        counter: counter, 
        gallery: gallery_name, 
        duration : $scope.transaction_duration,
        customer_ticket_id : $scope.current_customer.id

      }

      /* save current transaction */

      $http({
          url: '/api/customer_tagging_transactions/closed',
          method: "POST",
          data: data
      }).then(function(response){

        if(response.data.result == "failed"){

          var confirm = $mdDialog.confirm()
          .title('Response Server')
          .textContent(response.data.message)
          .ariaLabel('response')
          .ok('OK')

          $mdDialog.show(confirm)

        }else{

          /* reset tagging transaction */

          $scope.tagging_code = "";
          $scope.tagging_level_1 = "";
          $scope.tagging_level_2 = "";
          $scope.tagging_level_3 = "";
          $scope.tagging_level_4 = "";
          $scope.sla = "";
          $interval.cancel(timer);
          $scope.transaction_duration = "00:00";
          $scope.current_customer = [];
        }

      });


    }
    $scope.transfer = function(ev) {

      $mdDialog.show({
        controller: function () { this.parent = $scope; },
        controllerAs: 'ctrl',
        templateUrl: 'app/admin/socket/transfer.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      });

    };

    $scope.doTransferCustomer = function(){

      var data = { 
        from_counter : counter, 
        to_counter : $scope.transfer_counter, 
        customer : $scope.current_customer.customer, 
        gallery: gallery_name, 
        queueing_number : $scope.current_customer.queueing_number,
        note: $scope.transfer_note
      }

      /* save current transaction */

      $http({
          url: '/api/transfer_customers/save',
          method: "POST",
          data: data
      }).then(function(response){

        if(response.data.result=="success"){  

           var confirm = $mdDialog.confirm()
            .title('Transfer Response')
            .textContent(response.data.message)
            .ariaLabel('response')
            .ok('OK')

            $mdDialog.show(confirm)

        }

      });

    }
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

  });