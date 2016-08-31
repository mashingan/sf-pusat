'use strict';

angular.module('smartfrenApp')
  .controller('TvDisplayCtrl', function ($scope, $sce, $timeout, $stateParams, TvDisplayService, AgentDetailService, RequestHandler, Speech, socket, $http, $mdDialog) {
    var counter = 1;

    $scope.logo = 'assets/images/logo-white.png';
    $scope.smartfren4G = 'assets/images/smartfren4G-l.png';
    $scope.sinarmas = 'assets/images/sinarmas-l.png';
    $scope.running_text = [];

    var gallery = {
      name: $stateParams.galleryName,
      id: $stateParams.galleryId
    };

    var gallery_id = gallery.id;

    var max = {
      waiting_list: 5,
      counter_list: 3
    };

    var date = moment(new Date()).format("YYYY-MM-DD");
    var speecConfig = {
      lang:'id',
      rate:.8
    }

    //INIT
    function init() {
      loadCounterList();
      loadWaitingList();
      loadRunningText();
      initSocket();
      // Speech.tts('Kenapa ga ada',{lang:'id',rate:.8})
    }

    function loadCounterList() {
      TvDisplayService.counterList(gallery.name, date).then(function (response) {
        $scope.counter_list = cleanData(response.data.data || [], max.counter_list);
      }, RequestHandler.onError)
    }

    function loadWaitingList() {
      TvDisplayService.waitingList(gallery.name, date).then(function (response) {
        $scope.waiting_list = cleanData(response.data.data || [], max.waiting_list);
      });
    }

    function loadRunningText() {
      TvDisplayService.runningText().then(function (response) {
        $scope.running_text = response.data.running_text.split(',');
        $scope.metaGallery = response.data;
        initCurrentCustomerSocket();
      }, RequestHandler.onError)
    }


    init();
    //##

    //CLEAN DATA
    function cleanData(data, max) {
      return data.filter(function (d, i) {
        return i < max
      });
    }

    //##

    //SOCKET
    function initSocket() {
      //socket.forward('connect', $scope);
      //socket.forward('disconnect', $scope);
      socket.forward('tvdisplay:running_text:' + gallery_id, $scope);
      socket.forward('tvdisplay:counter_list:' + gallery_id, $scope);
      socket.forward('tvdisplay:waiting_list:' + gallery_id, $scope);
      socket.forward('agent:recall_customer:' + gallery_id, $scope);

      //$scope.$on('socket:connect', function () {
      //  $scope.onSocket = true;
      //});
      //
      //$scope.$on('socket:disconnect', function () {
      //  $scope.onSocket = false;
      //});

      $scope.$on('socket:tvdisplay:running_text:' + gallery_id, function (env, data) {

        $scope.running_text = data.split(',');

      });
      $scope.$on('socket:tvdisplay:counter_list:' + gallery_id, function (env, data) {

        $scope.counter_list = data;

      });
      $scope.$on('socket:tvdisplay:waiting_list:' + gallery_id, function (env, data) {

        $scope.waiting_list = data;

      });
      $scope.$on('socket:agent:recall_customer:' + gallery_id, function (env, data) {
        Speech.tts(data.customer + ', Antrian No ' + data.queueing_number + ', ke Counter ' + data.counter,speecConfig)
      });
    }

    function initCurrentCustomerSocket() {
      for (var i = 1; i <= $scope.metaGallery.counter_count; i++) {
        socket.forward('agent:current_customer:' + gallery_id + ':' + i, $scope);
        $scope.$on('socket:agent:current_customer:' + gallery_id + ':' + i, function (env, data) {
          var message = data.customer + ', Antrian No ' + data.queueing_number + ', ke Counter ' + data.counter
            Speech.tts(message,speecConfig)
        })
      }
    }

    //##
  });
