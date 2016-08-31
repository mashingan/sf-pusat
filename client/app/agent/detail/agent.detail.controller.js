'use strict';

angular.module('smartfrenApp')
  .controller('AgentDetailCtrl', function ($scope,$http,Dialog,$state, $stateParams, $interval,RequestHandler, socket, AgentDetailService, Auth, $mdDialog, KioskService,GalleriesService) {
    $scope.user = Auth.getCurrentUser();

    $scope.logo = 'assets/images/logo-white.png';
    $scope.current_customer;
    $scope.date = moment(new Date()).format('YYYY-MM-DD');

    $scope.gallery = {
      name:$stateParams.galleryName,
      counter:$stateParams.counter,
      id:$stateParams.galleryId
    };

    var gallery_id = $scope.gallery.id;
    var counter = $scope.gallery.counter;

    $scope.transactionData;
    $scope.isTagging = false;

    var timer;
    var breakTimeTimer;

    //INIT
    function init(){
      if($scope.user.role != 'CSR'){
        $state.go('agentLogin');
        Dialog.showToast({message:'Access Denied !'})
      };
      $scope.loadCurrentCustomer();
      getWaitingList();
      loadGalleryDetail();
      initSocket();
      initCurrentCustomerSocket();
    }

    $scope.loadCurrentCustomer = function(){
      resetAll();
      AgentDetailService.currentCustomer($scope.gallery.name,$scope.gallery.counter, $scope.date).then(function(response){
        $scope.current_customer = response.data;
      },RequestHandler.onError);
    }

    function getWaitingList(){
      AgentDetailService.waiting().then(function(response){
        $scope.waiting_list = response.data.data;
      })
    }

    function resetAll(){
      $scope.tagging = {};
      $scope.sla = "";
      $interval.cancel(timer);
      $scope.transaction_duration = "00:00";
      $scope.current_customer = null;
    }

    function loadGalleryDetail(){
      GalleriesService.get(gallery_id).then(function(response){
        $scope.galleryDetail = response.data;
      },RequestHandler.onError);
    }

    init();
    //##

    //TAGGING CODE
    $scope.getTaggingCode = function(){
      AgentDetailService.taggingTransaction($scope.tagging.code).then(function(response){
        if(response.data.result == "failed"){
          Dialog.showDialog({
            title:'Response Server',
            content:response.data.message
          })
        }else{
          $scope.tagging.level_1 = response.data.level_1;
          $scope.tagging.level_2 = response.data.level_2;
          $scope.tagging.level_3 = response.data.level_3;
          $scope.tagging.level_4 = response.data.level_4;
          $scope.tagging.success = true;
          $scope.sla = response.data.sla;

          $scope.isTagging = true;

          newTimer();
        }
      })
    };
    //##

    //TIMER
    function newTimer(){
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
              Dialog.showDialog({
                title:'SLA Alert',
                content:'Durasi transaksi melebihi SLA',
                submitLabel:'OK'
              })
            }
          }
        }
      }, 1000);
    }
    //##

    //BREAK TIME
    $scope.breakTime = function(){
      $scope.breakTimeData = null;
      Dialog.showDialogTemplate({
        templateUrl:'app/agent/detail/dialog/agent.detail.break.time.html',
        controller:'AgentDetailBreakTimeCtrl',
        submit:function(set){
          //set.nik = $scope.user.nik;
          //set.agent = $scope.user.name;
          //set.date = moment().format('YYYY-MM-DD');
          //set.start_time = moment().format('HH:MM:SS');
          //set.start = moment();

          $scope.breakTimeData = {
            nik:$scope.user.nik,
            agent:$scope.user.name,
            date:moment().format('YYYY-MM-DD'),
            start_time:moment().format('HH:mm:ss'),
            start:moment(),
            type_of_breaktime:set.selected.name
          };

          AgentDetailService.breakTime($scope.breakTimeData).then(function(response){
            $scope.isBreakTime = true;
            startBreakTime(set.selected.time);
          },RequestHandler.onError)
        }
      })
    };

    $scope.resume = function(){
      if($scope.breakTimeData){
        $scope.breakTimeData.end_time = moment().format('HH:mm:ss');
        var duration = moment.duration(moment(moment()).diff($scope.breakTimeData.start));
        $scope.breakTimeData.duration = duration.minutes()+':'+duration.seconds();
        delete $scope.breakTimeData.start;
        delete $scope.breakTimeData.remaining;
        delete $scope.breakTimeData.isUp;

        clearInterval(breakTimeTimer);

        AgentDetailService.updateBreakTime($scope.breakTimeData).then(function(){
          $scope.isBreakTime = false;
          $scope.breakTimeData = null;
        },RequestHandler.onError)
      }
    };

    function startBreakTime(time){
      var eventTime = moment().add(time,'m');
      var currentTime;
      var duration;

      breakTimeTimer = setInterval(function(){
        tick();
        if(duration <= 0){
          clearInterval(breakTimeTimer);
          $scope.breakTimeData.isUp = true;
        }
      },1000)

      function tick(){
        currentTime = moment();
        duration = moment.duration(eventTime.diff(currentTime));
        $scope.breakTimeData.remaining = duration.minutes()+':'+duration.seconds();
      }

      tick();
    }
    //##

    //QUERY MDN
      $scope.queryMDN = function(){
        Dialog.showDialog({
          title:'Add Customer',
          content:'Add customer with name Rita  Kartini?',
          submit:function(){}
        })
      };
    //##

    //LOGOUT
    $scope.logout = function(){
      $state.go('agentLogin');
    }
    //##

    //NEXT TRANSACTION
    $scope.nextTransaction = function(){
      // $scope.tagging.level.push({message:null})
      var time = moment().format('HH:mm');
      var data = { 
        tagging_code : $scope.tagging.code, 
        customer : $scope.current_customer.customer, 
        agent : $scope.user.name, 
        date: $scope.date, 
        time: time, 
        counter: counter, 
        gallery: $scope.gallery.name, 
        duration : $scope.transaction_duration 
      }

      AgentDetailService.nextTransaction(data).then(function(response){
        if(response.data.result == 'failed'){
          Dialog.showDialog({
            title:'Response',
            content:response.data.message
          })
        }else{
          $scope.tagging = {};
          $scope.sla = "";
          $interval.cancel(timer);
          $scope.transaction_duration = "00:00";

          Dialog.showToast({message:response.data.message})
        }
      },RequestHandler.onError)
    }
    //##

    //CLOSE
    $scope.close = function(){
      Dialog.showDialog({
        title:'Close',
        content:'Close this transaction?',
        submit:function(){
          AgentDetailService.close({
            tagging_code : $scope.tagging.code,
            customer : $scope.current_customer.customer,
            agent : $scope.user.role,
            date: $scope.date,
            time: moment().format('HH:mm'),
            counter: $scope.gallery.counter,
            gallery: $scope.gallery.name,
            duration : $scope.transaction_duration,
            customer_ticket_id : $scope.current_customer.id
          }).then(function(response){
            if(response.data.result == 'failed'){
              Dialog.showDialog({
                title:'Response Server',
                content:response.data.message,
                submitLabel:'OK'
              })
            }else{
              resetAll()
            }
          },RequestHandler.onError)
        }
      })
    }
    //##

    //NEXT
    $scope.next = function(){
      Dialog.showToast({message:'calling next queue..'});
      AgentDetailService.next($scope.current_customer||{}).then(function(response){
        Dialog.showToast({message:response.data.message})
      },RequestHandler.onError)
    };
    //##

    //NO SHOW
    $scope.noShow = function(){
      Dialog.showDialog({
        title:'No Show',
        content:'Customer with name '+$scope.current_customer.customer+', does not seem?',
        submit:function(){
          AgentDetailService.noShow($scope.current_customer).then(function(response){
            resetAll();
            Dialog.showToast({message:response.data.messge});
          })
        }
      })
    }
    //##

    //REPEAT
    $scope.repeat = function(){
      AgentDetailService.repeat($scope.current_customer).then(function(response){
        console.log(response)
      },RequestHandler.onError)
    }
    //##

    //TRANSFER
    $scope.transfer = function(){
      Dialog.showDialogTemplate({
        templateUrl:'app/agent/detail/dialog/agent.detail.transfer.html',
        controller:'AgentDetailTransferCtrl',
        body:{
          current_customer:$scope.current_customer,
          gallery:$scope.gallery
        },
        submit:function(set){
          AgentDetailService.transfer({
            from_counter:counter,
            to_counter:set.to_counter,
            customer:$scope.current_customer.customer,
            gallery:$scope.gallery.name,
            note:set.note
          }).then(function(response){
            Dialog.showDialog({
              title:'Transfer',
              content:response.data.message,
              submitLabel:'OK'
            })
          },RequestHandler.onError)
        }
      })
    };

    $scope.incomingTransfer = function(){
      Dialog.showDialogTemplate({
        controller:'AgentDetailIncomingTransferCtrl',
        templateUrl:'app/agent/detail/dialog/agent.detail.incoming.transfer.html',
        body:$scope.incoming_transfer_customer,
        submit:function(set){
          $scope.current_customer = set;
        }
      })
    }
    //##

    //WALK DIRECT
    $scope.walkDirect = function(){
      Dialog.showDialogTemplate({
        templateUrl:'app/agent/detail/dialog/agent.detail.walk.direct.html',
        controller:'AgentDetailWalkDirectCtrl',
        submit:function(set){
          KioskService.checkMdn(set).then(function(response){
            if(response.data.result == 'failed'){
              Dialog.showToast({message:'MDN is not registered'});
            }else{
              Dialog.showDialogTemplate({
                templateUrl:'app/agent/detail/dialog/agent.detail.customer.html',
                controller:'AgentDetailCustomerCtrl',
                body:{
                  set:response.data,
                  type_of_service:$scope.galleryDetail.type_of_service
                },
                submit:function(_set){
                  KioskService.newCustomer({
                    queueing_number:'00',
                    customer:_set.name,
                    gallery:$scope.gallery.name,
                    estimated_waiting_time:'-',
                    type_of_service:_set.type_of_service
                  }).then(function(response){
                    Dialog.showToast({message:'Customer has been succsessfully added to the queue'})
                  },RequestHandler.onError)
                }
              })
            }
          },RequestHandler.onError)
        }
      })
    }
    //##

    //RECALL
    $scope.recall = function(){
      AgentDetailService.recall($scope.current_customer).then(function(response){
        Dialog.showToast({message:$scope.current_customer.customer+' has been called'});
      },RequestHandler.onError)
    }
    //##

    //CALL
    $scope.call = function(){
      AgentDetailService.call($scope.gallery.id,$scope.gallery.counter).then(function(response){
        if(response.data.result == 'failed'){
          Dialog.showToast({message:response.data.message})
        }
      },RequestHandler.onError)
    }
    //##

    //SOCKET
    function initCurrentCustomerSocket(){
      $http.get('/api/galleries/'+gallery_id).then(function(gallery){
        $scope.counters = gallery.data.counter_count;
        for(var i = 0; i < $scope.counters;i++){
          socket.forward('agent:current_customer:'+gallery_id+':'+(i+1), $scope);
          $scope.$on('socket:agent:current_customer:'+gallery_id+':'+(i+1), function(env, data){
            if($scope.current_customer){
              var confirm = $mdDialog.confirm()
                .title('Attention !')
                .textContent(data.customer + ', Antrian No ' + data.queueing_number + ' ke Counter ' + data.counter)
                .ariaLabel('response')
                .ok('OK')

              $mdDialog.show(confirm)
            }
            $scope.current_customer = data;
          });
        }
      });
    };

    function initSocket() {
      socket.forward('connect', $scope);
      socket.forward('disconnect', $scope);
      socket.forward('agent:incoming_transfer_customer:' + gallery_id + ':' + counter, $scope);
      //socket.forward('agent:current_customer:' + gallery_id + ':' + counter, $scope);
      //socket.forward('agent:recall_customer:' + gallery_id, $scope);
      socket.forward('agent:waiting_list:' + gallery_id, $scope);

      $scope.$on('socket:connect', function () {
        $scope.onSocket = true;
      });

      $scope.$on('socket:disconnect', function () {
        $scope.onSocket = false;
      });

      $scope.$on('socket:agent:waiting_list:' + gallery_id, function (env, data) {
        $scope.waiting_list = data;
      });

      $scope.$on('socket:agent:incoming_transfer_customer:' + gallery_id + ':' + counter, function (env, incoming_transfer_customer) {
        Dialog.showToast({
          message:'New incoming transfer!'
        })
        $scope.incoming_transfer_customer = incoming_transfer_customer.data;

      });
      //$scope.$on('socket:agent:current_customer:' + gallery_id + ':' + counter, function (env, data) {
      //  if (!$scope.current_customer) {
      //
      //    var confirm = $mdDialog.confirm()
      //      .title('Attention !')
      //      .textContent(data.customer + ', Antrian No. ' + data.queueing_number + ' ke Counter ' + data.counter)
      //      .ariaLabel('response')
      //      .ok('OK')
      //
      //    $mdDialog.show(confirm)
      //
      //  }
      //
      //  $scope.current_customer = data;
      //
      //
      //});

      //$scope.$on('socket:agent:recall_customer:' + gallery_id, function (env, data) {
      //
      //  var confirm = $mdDialog.confirm()
      //    .title('Attention !')
      //    .textContent(data.customer + ', Antrian No. ' + data.queueing_number + ' ke Counter ' + data.counter)
      //    .ariaLabel('response')
      //    .ok('OK')
      //
      //  $mdDialog.show(confirm)
      //
      //});
    }
    //##

    //LOGOUT
    $scope.logout = function(){
      Auth.logout();
      $state.go('agentLogin');
    }
    //##
  });
