'use strict';

angular.module('smartfrenApp')
  .controller('MainCtrl', function ($scope, $http, $log, $timeout, socket, MainService, Dialog) {
    //OLD
    //$scope.awesomeThings = [];
    //
    //$http.get('/api/things').success(function (awesomeThings) {
    //  $scope.awesomeThings = awesomeThings;
    //  socket.syncUpdates('thing', $scope.awesomeThings);
    //});
    //
    //$scope.addThing = function () {
    //  if ($scope.newThing === '') {
    //    return;
    //  }
    //  $http.post('/api/things', {name: $scope.newThing});
    //  $scope.newThing = '';
    //};
    //
    //$scope.deleteThing = function (thing) {
    //  $http.delete('/api/things/' + thing._id);
    //};
    //
    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});
    //##

    //NEW
    $scope.modules = [];
    $scope.logos = 'assets/images/logo-white.png';
    $scope.smartfren4G = 'assets/images/smartfren4G-l.png';
    $scope.sinarmas = 'assets/images/sinarmas-l.png';

    //INIT
    function init() {
      getModules();
      //chrome.tts.speak('Speak this next, when the first sentence is done.', {'enqueue': true})
    }

    function getModules() {
      MainService.module.get().then(function (response) {
        $scope.modules = response.data;
        //socket.syncUpdates('modules', $scope.modules);
      })
    }

    init();
    //##

    //GALLERIES
    $scope.selectGalleries = function(){
      Dialog.showDialogTemplate({
        controller:'GalleriesCtrl',
        templateUrl:'app/galleries/galleries.html',
        submit:function(set){

        }
      })
    }
    //##
  });
