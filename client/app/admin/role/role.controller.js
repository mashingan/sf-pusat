'use strict';

angular.module('smartfrenApp')
  .controller('RoleCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Role').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:role', $scope);

    $scope.$on('socket:activity:modul:role', function(env, data){

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
      descendFirst: true,
      name: 'Name',
      orderBy: 'name'
    },
    {
      name: 'Description',
      orderBy: 'description'
    }
    ];

    getRoles(angular.extend({}, $scope.query));

    function getRoles(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/roles/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/roles/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (roles) {

        $scope.roles = roles.data[0].data_role;
        $scope.roles.count = roles.data[0].count;

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getRoles(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.role_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getRoles(angular.extend({}, $scope.query, {order: order}));
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
        getRoles(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/role');
    }

    $scope.edit = function(id){

        $location.path('/role/edit/'+id);

    }
    $scope.add_new = function(){

        $location.path('/role/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(roles){

        $scope.showConfirmDA(roles);

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

                $http.delete('/api/roles/'+id+'/'+currentUser.nik).then(function (res) {

                    getRoles(angular.extend({}, $scope.query));
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
    $scope.showConfirmDA = function(roles) {

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
                    url: '/api/roles/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: roles
                })
                .then(function(response) {

                    // success
                    getRoles(angular.extend({}, $scope.query));

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

                    // faled
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
  .controller('RoleEditCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

    var currentUser = Auth.getCurrentUser();
    
    $http.get('/api/user_activities/modul/Role').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:role', $scope);

    $scope.$on('socket:activity:modul:role', function(env, data){

      $scope.activities = data;

    });

    $scope.param = $stateParams.id;

    if(typeof $scope.param != 'undefined'){

      $http.get('/api/roles/'+$scope.param).then(function (role) {

        $scope.role = role.data;

      },function(data) {

        window.location.href='/role';

      });

      $scope.update_role = function(form) {
          $scope.progress();
          $scope.role.id = $scope.param;
          $scope.role.user_op = currentUser.nik;
          $http({
              url: '/api/roles/update',
              method: "POST",
              data: $scope.role
          })
          .then(function(response) {
                  // success
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
        controller: 'RoleCtrl',
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

        $location.path('/role');

    }
  })
  .controller('RoleAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      
      $scope.privilege_menus = [];
      $scope.child_item = {};
      $scope.parent_item = {};
      $scope.menu_items = [
      
      {
          id: 'dashboard',
              name: 'Dashboard',
              state: 'admin',
              type: 'link',
              icon: 'fa fa-bar-chart'

          },
          {
              id: 'server_monitor',
              name: 'Server Monitor',
              state: 'server_monitor',
              type: 'link',
              icon: 'fa fa-tachometer'

          },
          {
            name: 'Report',
            type: 'toggle',
            icon: 'fa fa-tasks fix-margin',
            pages: [{
                id: 'rpt_1',
                name: 'Productivity National',
                state: 'rpt_productivity_national'
            }, {
                id: 'rpt_2',
                name: 'Productivity Gallery',
                state: 'rpt_productivity_gallery'
            }, {
                id: 'rpt_3',
                name: 'Queueing Transaction',
                state: 'rpt_queueing_transaction'
            }, {
                id: 'rpt_4',
                name: 'Type Of Service Transaction',
                state: 'rpt_type_of_service_transaction'
            }, {
                id: 'rpt_5',
                name: 'Agent Breaktime',
                state: 'rpt_agent_breaktime'
            }]
        },
        {
          name: 'Configuration',
          type: 'toggle',
          icon: 'fa fa-cogs fix-margin',
          pages: [{
              id: 'config_1',
              name: 'Email SMTP',
              state: 'smtp_gmail_config'
          },{
              id: 'config_2',
              name: 'Email Forgot Password Template',
              state: 'template_email_config',
          },{
              id: 'config_3',
              name: 'Email Activation Template',
              state: 'template_email_activation_config',
          },{
              id: 'config_4',
              name: 'Zsmart API',
              state: 'zsmart_api_config'
          },{
              id: 'config_5',
              name: 'Gallery Config',
              state: 'gallery_config'
          },{
              id: 'config_6',
              name: 'Sms Template',
              state: 'template_sms'
          },{
              id: 'config_7',
              name: 'Version',
              state: 'version'
          }
        ]
      },
      {
          name: 'Data Master',
          type: 'toggle',
          icon: 'fa fa-pencil-square-o fix-margin',
          pages: [{
              id: 'man_1',
              name: 'Gallery',
              state: 'gallery'
          },{
              id: 'man_2',
              name: 'Type of Service',
              state: 'typeofservice'
          },{
              id: 'man_4',
              name: 'Tagging Transaction',
              state: 'tagging_transaction'
          },{
              id: 'man_5',
              name: 'Skillset',
              state: 'skillset'
          },{
              id: 'man_6',
              name: 'Role',
              state: 'role'
          },{
              id: 'man_7',
              name: 'User',
              state: 'user'
          }
        ]
      },
      {
          name: 'Mobile Master',
          type: 'toggle',
          icon: 'fa fa-pencil-square-o fix-margin',
          pages: [{
              id: 'man_1',
              name: 'Handset Type',
              state: 'handsettype'
          },{
              id: 'man_2',
              name: 'City',
              state: 'city'
          },{
              id: 'man_3',
              name: 'Province',
              state: 'province'
          }
        ]
      }
      ];

      for(var i=0;i<$scope.menu_items.length;i++){

        $scope.parent_item[$scope.menu_items[i].name] = false;
        
        if($scope.menu_items[i].pages){

          for(var j=0;j<$scope.menu_items[i].pages.length;j++){

            $scope.child_item[$scope.menu_items[i].pages[j].name] = false;

          }

        }

      }

      var currentUser = Auth.getCurrentUser();
      
      $http.get('/api/user_activities/modul/Role').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:role', $scope);

      $scope.$on('socket:activity:modul:role', function(env, data){

        $scope.activities = data;

      });

      $scope.add_role = function(form) {
          $scope.progress();
          $scope.role.user_op = currentUser.nik;
          $scope.role.menu_privilege = $scope.privilege_menus;
          $http({
              url: '/api/roles',
              method: "POST",
              data: $scope.role
          })
          .then(function(response) {
                  // success
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
                  $location.path('/role');
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
    $scope.appendPrivilege = function(item){

       var item_exist = $scope.privilege_menus.filter(function(a){ return a.name == item.name })[0];
       if(!item_exist){
          
          if(item.pages){

            $scope.privilege_menus.push({ name: item.name, pages: item.pages, icon : item.icon, type: item.type });

            for(var i=0;i < item.pages.length;i++){

              $scope.child_item[item.pages[i].name] = true;

            }

          }else{

             $scope.privilege_menus.push({ name: item.name, icon : item.icon, type: item.type, state: item.state });

          }
       }else{

          if(item.pages){

            for(var i=0;i < item.pages.length;i++){

              $scope.child_item[item.pages[i].name] = false;

            }

          }

          $scope.privilege_menus = $scope.privilege_menus.filter(function(a){ return a.name != item.name });
       }

       console.log($scope.privilege_menus);

    }
    $scope.appendChildPrivilege = function(child, item){


      var item_exist = $scope.privilege_menus.filter(function(a){ return a.name == item.name })[0];
      if(!item_exist){


          if($scope.child_item[child.name]){
            
            var child_exist = item.pages.filter(function(a){ return a.name == child.name })[0];

            if(child_exist){

              var item_prive = { name : item.name, type: item.type, icon: item.icon, pages: item.pages }
              item_prive.pages = item.pages.filter(function(a){ return a.name != child.name });
              $scope.privilege_menus.push(item_prive);

            }
          
          }else{
            
            $scope.privilege_menus.push({ name: item.name, pages: [], icon : item.icon, toggle: item.toggle });

            var parent = $scope.privilege_menus.filter(function(a){ return a.name == item.name })[0];
            
            if(parent){

              var child_exist = parent.pages.filter(function(a){ return a.name == child.name })[0];

              if(!child_exist){
  
                parent.pages.push(child);


              }

            }
            
          }

          $scope.parent_item[item.name] = true;

       }else{
          if($scope.child_item[child.name]){
            

            var parent = $scope.privilege_menus.filter(function(a){ return a.name == item.name })[0];

            if(parent){

              var child_exist = parent.pages.filter(function(a){ return a.name == child.name })[0];

              if(child_exist){
  
                parent.pages = parent.pages.filter(function(a){ return a.name != child.name });


              }

              if(parent.pages.length == 0){

                $scope.parent_item[item.name] = false;
                $scope.privilege_menus = $scope.privilege_menus.filter(function(a){ return a.name != item.name });

              }

            }


          }else{
            
            var parent = $scope.privilege_menus.filter(function(a){ return a.name == item.name })[0];

            if(parent){

              var child_exist = parent.pages.filter(function(a){ return a.name == child.name })[0];

              if(!child_exist){
  
                parent.pages.push(child);


              }

            }

          }

       }
      
       console.log($scope.privilege_menus);


    } 
    $scope.redirect_back = function(){

        $location.path('/role');

    }
  });
