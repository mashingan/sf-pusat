'use strict';

angular.module('smartfrenApp')
  .controller('SkillsetCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Skillset').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:skillset', $scope);

    $scope.$on('socket:activity:modul:skillset', function(env, data){

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
      order: 'priorities',
      limit: 10,
      page: 1
    };
    $scope.columns = [
    {
      descendFirst: true,
      name: 'priorities',
      orderBy: 'priorities'
    }
    ];

    getSkillset(angular.extend({}, $scope.query));

    function getSkillset(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/skillsets/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/skillsets/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (skillsets) {

        $scope.skillsets = skillsets.data[0].data_skillset;
        $scope.skillsets.count = skillsets.data[0].count;
        $scope.row_count = skillsets.data[0].count;
        console.log($scope.skillsets);

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getSkillset(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.skillset_id = item._id;
      console.log(item);

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getSkillset(angular.extend({}, $scope.query, {order: order}));
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
        getSkillset(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/skillset');

    }

    $scope.edit = function(id){

        $location.path('/skillset/edit/'+id);

    }
    $scope.add_new = function(){

        $location.path('/skillset/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(skillsets){

        $scope.showConfirmDA(skillsets);


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

                $http.delete('/api/skillsets/'+id+'/'+currentUser.nik).then(function (res) {

                    getSkillset(angular.extend({}, $scope.query));
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
    $scope.showConfirmDA = function(skillsets) {

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
                    url: '/api/skillsets/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: skillsets
                })
                .then(function(response) {

                    getSkillset(angular.extend({}, $scope.query));
                    
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

                    getSkillset(angular.extend({}, $scope.query));

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
  .controller('SkillsetEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Skillset').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:skillset', $scope);

    $scope.$on('socket:activity:modul:skillset', function(env, data){

      $scope.activities = data;

    });
    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){

      $http.get('/api/skillsets/show/'+$scope.param).then(function (skillset) {

        $scope.skillset = skillset.data;
        $scope.priorities = [];
        $scope.priority_level = [];
        var selected_data = []; 
        var priority_data = [];


        for(var i =0; i < $scope.skillset.priorities.length; i++){

          priority_data = diff($scope.skillset.priorities,selected_data);


          selected_data.push($scope.skillset.priorities[i]);

          $scope.priorities.push({level: i, data: priority_data});

          $scope.priority_level[i] = $scope.skillset.priorities[i];
          

        }

      },function(data) {

        $location.path('/skillset');

      });

      function diff(a1, a2) {
        return a1.concat(a2).filter(function(val, index, arr){
          return arr.indexOf(val) === arr.lastIndexOf(val);
        });
      }

      $scope.update_typeofservice = function(form) {
          $scope.progress();
          $scope.skillset.id = $scope.param;
          $scope.skillset.user_op = currentUser.nik;
          $scope.skillset.priorities = $scope.priority_level;

          $http({
              url: '/api/skillsets/update',
              method: "POST",
              data: $scope.skillset
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

        $location.path('/skillset');

    }
  })
  .controller('SkillsetAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      var currentUser = Auth.getCurrentUser();
      var priority_count = 0;
      $scope.priorities = [];
      $scope.selectedPriorities = [];
      $scope.priority_level = [];

      $http.get('/api/typeofservices/-').then(function (typeofservices) {

          $scope.typeofservices = typeofservices.data;
          priority_count = typeofservices.data.length;
          if(priority_count > 0){

            $scope.priorities.push({ level: 1, data: typeofservices.data});

          }

      });

      $http.get('/api/user_activities/modul/Skillset').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:skillset', $scope);

      $scope.$on('socket:activity:modul:skillset', function(env, data){

        $scope.activities = data;

      });
      $scope.appendInput = function(index){

        var next_priority_data;

        if($scope.selectedPriorities.filter(function(a){ return a == index })[0]){

        }else{

          $scope.selectedPriorities.push(index);
        
        }

        if($scope.selectedPriorities.length > 0){
            
            next_priority_data = diff($scope.selectedPriorities, $scope.typeofservices);

            if(next_priority_data.length > 0){
              $scope.priorities.push({ level: $scope.priorities.length + 1, data: next_priority_data});
            }

        }
        
        
      }

      function diff(a1, a2) {
        return a1.concat(a2).filter(function(val, index, arr){
          return arr.indexOf(val) === arr.lastIndexOf(val);
        });
      }

      $scope.add_skillset = function(form) {
          $scope.progress();
          $http({
              url: '/api/skillsets',
              method: "POST",
              data: { priorities: $scope.selectedPriorities, user_op:  currentUser.nik }
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
                  $location.path('/skillset');
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

        $location.path('/skillset');

    }
  });
