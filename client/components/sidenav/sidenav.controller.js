'use strict';

angular.module('smartfrenApp')
  .controller('SidenavCtrl', function ($scope, $location, Auth, socket,   $timeout, $mdSidenav, $log, ssSideNav) {

    $scope.server_online = true;

    socket.forward('disconnect', $scope);
    socket.forward('connect', $scope);

    $scope.$on('socket:disconnect', function(){

        $scope.server_online = false;
        
    });

    $scope.$on('socket:connect', function(){

        $scope.server_online = true;
        
    });

    $scope.getCurrentUser = Auth.getCurrentUser();

    $scope.menu = ssSideNav;
    // Show or Hide menu
     ssSideNav.setVisible('link_1');
     ssSideNav.setVisibleFor([
     {
       id: 'toggle_item_1',
       value: true
     }, {
       id: 'link_1',
       value: true
     }
     ]);

     $timeout(function () {
       ssSideNav.setVisible('toogle_2', false);
     });

     $timeout(function () {
         // force selection on child dropdown menu item and select its state too.
         ssSideNav.forceSelectionWithId('toogle_1_link_2');
     }, 1000 * 3);
    // Use the User $resource to fetch all users


    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/manageLogin');
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });
