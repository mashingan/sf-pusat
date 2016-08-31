'use strict';

angular.module('smartfrenApp')
  .controller('ConfigurationEmailSMTPCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    
    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/SMTP%20EMAIL').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:smtp_email', $scope);

    $scope.$on('socket:activity:modul:smtp_email', function(env, data){

      $scope.activities = data;

    });

    $http.get('/api/configurations/smtp_config').then(function (config) {

      $scope.smtp_user = config.data.data[0].value;
      $scope.smtp_password = config.data.data[1].value;

    });
    $scope.update_configuration = function(form) {

        $scope.progress();
        $http({
            url: '/api/configurations/smtp_config_update',
            method: "POST",
            data: { smtp_user: $scope.smtp_user, smtp_password: $scope.smtp_password, user_op: currentUser.nik  }
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
  })  
  .controller('ConfigurationEmailTemplateCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    
    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/EMAIL%20TEMPLATE').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:email_template', $scope);

    $scope.$on('socket:activity:modul:email_template', function(env, data){

      $scope.activities = data;

    });

    $http.get('/api/configurations/email_template').then(function (config) {

      $scope.email_template = config.data.data[0].value;
      $scope.email_subject = config.data.data[1].value;
      $scope.email_from = config.data.data[2].value;

    });
    $scope.update_configuration = function(form) {

        $scope.progress();
        $http({
            url: '/api/configurations/email_template_update',
            method: "POST",
            data: {  user_op: currentUser.nik, email_template: $scope.email_template, email_subject: $scope.email_subject, email_from: $scope.email_from }
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

  })
  .controller('ConfigurationEmailActivationTemplateCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    
    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/EMAIL%20ACTIVATION%20TEMPLATE').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:email_activation_template', $scope);

    $scope.$on('socket:activity:modul:email_activation_template', function(env, data){

      $scope.activities = data;

    });

    $http.get('/api/configurations/email_activation_template').then(function (config) {

      $scope.email_template = config.data.data[0].value;
      $scope.email_subject = config.data.data[1].value;
      $scope.email_from = config.data.data[2].value;

    });
    $scope.update_configuration = function(form) {

        $scope.progress();
        $http({
            url: '/api/configurations/email_activation_template_update',
            method: "POST",
            data: {  user_op: currentUser.nik, email_template: $scope.email_template, email_subject: $scope.email_subject, email_from: $scope.email_from }
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

  })
  .controller('ConfigurationZsmartAPICtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    
    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/ZSMART%20API').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:zsmart_api', $scope);

    $scope.$on('socket:activity:modul:zsmart_api', function(env, data){

      $scope.activities = data;

    });

    $http.get('/api/configurations/zsmart_api_config').then(function (config) {

      $scope.api_url = config.data.data[0].value;
      $scope.api_user = config.data.data[1].value;
      $scope.api_password = config.data.data[2].value;
      $scope.api_action_id = config.data.data[3].value;

    });
    $scope.update_configuration = function(form) {

        $scope.progress();
        $http({
            url: '/api/configurations/zsmart_api_config_update',
            method: "POST",
            data: { api_url: $scope.api_url, user: $scope.api_user, password: $scope.api_password, action_id: $scope.api_action_id, user_op: currentUser.nik }
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
  })
  .controller('ConfigurationGalleryCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    var currentUser = Auth.getCurrentUser();
    $scope.swt = [];
    $scope.sla = [];

    $http.get('/api/user_activities/modul/GALLERY%20CONFIG').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:gallery_config', $scope);

    $scope.$on('socket:activity:modul:gallery_config', function(env, data){

      $scope.activities = data;

    });

    $http.get('/api/typeofservices/data/-').then(function (typeofservices) {

      $scope.typeofservices = typeofservices.data;
      
      for(var i=0; i < $scope.typeofservices.length;i++){

        $scope.swt[i] = $scope.typeofservices[i].standart_waiting_time;
        $scope.sla[i] = $scope.typeofservices[i].sla;

      }


    });
    $http.get('/api/configurations/gallery_config').then(function (config) {

      $scope.distance = config.data.data[0].value;
      $scope.general_running_text = config.data.data[1].value;
      $scope.promo_text = config.data.data[2].value;

    });

    $scope.update_configuration = function(form) {


        $scope.progress();
        $http({
            url: '/api/configurations/gallery_config_update',
            method: "POST",
            data: { 

                distance: $scope.distance, 
                general_running_text: $scope.general_running_text,
                promo_text: $scope.promo_text,
                user_op: currentUser.nik,
                swt: $scope.swt,
                sla: $scope.sla 

            }
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
  })
  .controller('ConfigurationSMSTemplateCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
      var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/SMS%20TEMPLATE').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:sms_template', $scope);

    $scope.$on('socket:activity:modul:sms_template', function(env, data){

      $scope.activities = data;

    });

    $http.get('/api/configurations/sms_template').then(function (config) {

    console.log(config);
      $scope.sms_greeting_template = config.data.data[0].value;
      $scope.sms_notif_template = config.data.data[1].value;
      $scope.sms_promo_template = config.data.data[2].value;

    });

    $scope.update_configuration = function(form) {

        $scope.progress();
        $http({
            url: '/api/configurations/sms_template_update',
            method: "POST",
            data: { 
                greeting_template: $scope.sms_greeting_template, 
                notif_template: $scope.sms_notif_template, 
                promo_template: $scope.sms_promo_template, 
                user_op: currentUser.nik 
            }
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
})
.controller('ConfigurationVersionCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/VERSION').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:version', $scope);

    $scope.$on('socket:activity:modul:version', function(env, data){

      $scope.activities = data;

    });

    $http.get('/public/version.json').success(function (data) {

        $scope.version = data;

    });
    $http.get('/api/configurations/version').success(function (data) {

        $scope.apk_file = data.apk_files;
        $scope.exe_file = data.exe_files;

    });

    $scope.delete_file = function(type, filename) {

         var confirm = $mdDialog.confirm()
                .title('Confirm')
                .textContent('Are you sure?')
                .ariaLabel('Confirm')
                .ok('Yes')
                .cancel('Cancel');

                $mdDialog.show(confirm).then(function() {
                  $scope.selected = [];
                  $scope.promise = $timeout(function () {

                    $http.get('/api/configurations/delete_file/'+type+'/'+filename).then(function (res) {

                        window.location.reload();

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
    $scope.update_version = function(form) {

          $scope.progress();

          var formData = new FormData();
          var i = 0;
          var files = [];

          angular.forEach($scope.exe_files,function(obj){

              formData.append('exe_files['+i+']', obj.lfFile);

              i++;

          });
          
          angular.forEach($scope.apk_files,function(obj){

              formData.append('apk_files['+i+']', obj.lfFile);

              i++;

          });

          formData.append('user_op',currentUser.nik);

          $http.post('/api/configurations/version_update', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
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
                  
              });
              window.location.reload();

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

});    
