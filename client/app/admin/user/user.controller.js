'use strict';

angular.module('smartfrenApp')
  .controller('UserCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/User').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:user', $scope);

    $scope.$on('socket:activity:modul:user', function(env, data){

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
      limit: 5,
      page: 1
    };
    $scope.columns = [
    {
      name: 'Provider',
      orderBy: 'provider'
    },
    {
      descendFirst: true,
      name: 'Name',
      orderBy: 'name'
    },
    {
      name: 'Email',
      orderBy: 'email'
    },
    {
      name: 'Role',
      orderBy: 'role'
    }
    ];

    getUsers(angular.extend({}, $scope.query));

    function getUsers(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/users/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/users/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (users) {

        $scope.users = users.data[0].data_user;
        $scope.users.count = users.data[0].count;

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getUsers(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.user_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getUsers(angular.extend({}, $scope.query, {order: order}));
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
        getUsers(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/user');

    }

    $scope.edit = function(id){

        $location.path('/user/edit/'+id);

    }
    $scope.add_new = function(){

        $location.path('/user/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(users){

        $scope.showConfirmDA(users);

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

                $http.delete('/api/users/'+id+'/'+currentUser.nik).then(function (res) {

                    getUsers(angular.extend({}, $scope.query));
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

      });

    };
    $scope.showConfirmDA = function(users) {

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
                    url: '/api/users/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: users
                })
                .then(function(response) {

                    getUsers(angular.extend({}, $scope.query));
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
  .controller('UserEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    var currentUser = Auth.getCurrentUser();
      
    $http.get('/api/user_activities/modul/User').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:user', $scope);

    $scope.$on('socket:activity:modul:user', function(env, data){

      $scope.activities = data;

    });

    $scope.param = $stateParams.id;


    $scope.$watch('files.length',function(newVal,oldVal){
         
    });

    $scope.counters = [];

    $http.get('/api/galleries/0/1/-name/-').then(function (galleries) {

      $scope.galleries = galleries.data.data;


    });
      
    $http.get('/api/roles').then(function (roles) {

      $scope.roles = roles.data;
      $scope.roles.push({name : "CSR", description: "-", menu_privilge: []});

    });
    
    if(typeof $scope.param != 'undefined'){

      $http.get('/api/users/'+$scope.param).then(function (user) {

        $scope.user = user.data;
        $scope.role_items = user.data.role_item;

        if(user.data.role=="CSR"){
          $scope.user.role_item['gallery'] = user.data.role_item[0].value;
          $scope.user.role_item['counter'] = user.data.role_item[1].value;
        }
        
        $scope.picture_path = 'media/user/' + user.data.picture;

      },function(data) {

       $location.path('/user');

      });


      $scope.update_user = function(form) {
          
          $scope.progress();
          $scope.user.id = $scope.param;

          var formData = new FormData();

          formData.append('id',$scope.user.id);
          formData.append('nik',$scope.user.nik);
          formData.append('name',$scope.user.name);
          formData.append('email',$scope.user.email);
          formData.append('role',$scope.user.role);
          formData.append('user_op',currentUser.nik);
          
          if($scope.user.role == "CSR"){
            formData.append('role_item_1',$scope.user.role_item["gallery"]);
            formData.append('role_item_2',$scope.user.role_item["counter"]);
          }

          formData.append('password',$scope.user.password);

          angular.forEach($scope.files,function(obj){

              formData.append('files[]', obj.lfFile);

          });

          $http.post('/api/users/update', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
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

    $scope.roleItem = function(role){

      if(role=="CSR"){

        $scope.role_items = [{ name: "Gallery", value: "" },{ name: "Counter", value:"" }];

      }else{

        $scope.role_items = [];

      }

    }
    $scope.getCounter = function(gal){

      $scope.counters = [];

      $http.get('/api/galleries/by_name/'+gal).then(function (gallery) {

        var counter_count = gallery.data.counter_count;
        for(var i = 0; i < counter_count; i++){
          $scope.counters.push(i+1);
        }
 
      });

    }
    $scope.removeImage = function(){


      $http.get('/api/users/delete_cover/' + $scope.param).then(function (user) {

        $scope.user.picture = null;
  

      });

    }
    $scope.redirect_back = function(){

        $location.path('/user');

    }


  })
  .controller('UserAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      var currentUser = Auth.getCurrentUser();
      
      $http.get('/api/user_activities/modul/User').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:user', $scope);

      $scope.$on('socket:activity:modul:user', function(env, data){

        $scope.activities = data;

      });

      $scope.counters = [];
      $scope.is_csr = false;

      $scope.$watch('files.length',function(newVal,oldVal){
         
      });

      $http.get('/api/galleries/0/1/-name/-').then(function (galleries) {

        $scope.galleries = galleries.data.data;

      });
      $http.get('/api/roles').then(function (roles) {

        $scope.roles = roles.data;
        $scope.roles.push({name : "CSR", description: "-", menu_privilge: []});

      });

      $http.get('/api/typeofservices/-').then(function(typeofservices){

        $scope.typeofservices = typeofservices.data;

      });

      $scope.add_user = function(form) {
          
          $scope.progress();

          var formData = new FormData();
          var tosmodel = [];

          formData.append('nik',$scope.user.nik);
          formData.append('name',$scope.user.name);
          formData.append('email',$scope.user.email);
          formData.append('role',$scope.user.role);
          formData.append('user_op',currentUser.nik);

          if($scope.user.role == "CSR"){
            formData.append('role_item_1',$scope.user.role_item["gallery"]);
            formData.append('role_item_2',$scope.user.role_item["counter"]);

            for(var i = 0; i < $scope.type_of_service.length;i++){

               tosmodel.push({name : $scope.type_of_service[i]});

            }
            formData.append('type_of_service',JSON.stringify(tosmodel));

          }
          
          formData.append('password',$scope.user.password);

          angular.forEach($scope.files,function(obj){

              formData.append('files[]', obj.lfFile);

          });

          $http.post('/api/users', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
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
                  $location.path('/user');
              });   

          },
          function(response) {
          
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

    $scope.roleItem = function(role){

      if(role=="CSR"){

        $scope.is_csr = true;
        $scope.role_items = [{ name: "Gallery", value: "" },{ name: "Counter", value:"" }];

      }else{

        $scope.role_items = [];

      }

    }
    $scope.getCounter = function(gal){

      $scope.counters = [];

      $http.get('/api/galleries/by_name/'+gal).then(function (gallery) {

        var counter_count = gallery.data.counter_count;
        for(var i = 0; i < counter_count; i++){
          $scope.counters.push(i+1);
        }
      
      });

    }
    $scope.redirect_back = function(){

        $location.path('/user');

    }

  });
