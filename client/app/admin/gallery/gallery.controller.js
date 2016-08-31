'use strict';

angular.module('smartfrenApp')
  .controller('GalleryCtrl', function ($scope, $http, socket,$mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $mdSidenav, $log, ssSideNav) {
    var bookmark;
    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/Gallery').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:gallery', $scope);

    $scope.$on('socket:activity:modul:gallery', function(env, data){

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
      name: 'Region',
      orderBy: 'city'
    },
    {
      name: 'Active',
      orderBy: 'active'
    }
    ];

    getGallery(angular.extend({}, $scope.query));

    function getGallery(query){

      var order = query.order;
      var limit = query.limit;
      var page  = query.page;
      var filter  = query.filter;
      var api_uri = '';

      if(filter==''||filter=='-'){
        api_uri = '/api/galleries/query/'+limit+'/'+page+'/'+order+'/-';
      }else{
        api_uri = '/api/galleries/query/'+limit+'/'+page+'/'+order+'/'+filter;
      }

      $http.get(api_uri).then(function (galleries) {

        $scope.galleries = [];
        $scope.galleries.count = 0;

        if(typeof galleries.data != 'undefined'){
          $scope.galleries = galleries.data[0].data_gallery;
          $scope.galleries.count = galleries.data[0].count;
        }

      });

    }

    $scope.onPaginate = function(page, limit) {

      $scope.promise = $timeout(function () {
          getGallery(angular.extend({}, $scope.query, {page: page,limit: limit}));
      }, 500);

    };

    $scope.deselect = function (item) {

    };

    $scope.log = function (item) {

      $scope.gallery_id = item._id;

    };

    $scope.loadStuff = function () {
      $scope.promise = $timeout(function () {

      }, 2000);
    };

    $scope.onReorder = function(order) {

      $scope.promise = $timeout(function () {
        getGallery(angular.extend({}, $scope.query, {order: order}));
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
        getGallery(angular.extend({}, $scope.query));
    });

    $scope.redirect_back = function(){

        $location.path('/gallery');

    }

    $scope.edit = function(id){

        $location.path('/gallery/edit/'+id);

    }
    $scope.add_new = function(){

        $location.path('/gallery/add');

    }
    $scope.delete = function(id){

        $scope.showConfirm(id);

    }
    $scope.delete_all = function(galleries){

        $scope.showConfirmDA(galleries);


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

                $http.delete('/api/galleries/'+id+'/'+currentUser.nik).then(function (res) {

                    getGallery(angular.extend({}, $scope.query));
                    
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Response Server')
                        .textContent('Data successfully deleted!')
                        .ariaLabel('Response')
                        .ok('Ok!')
                    )
                    .then(function(answer) {

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
    $scope.showConfirmDA = function(galleries) {

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
                    url: '/api/galleries/deleteall/'+currentUser.nik,
                    method: "POST",
                    data: galleries
                })
                .then(function(response) {

                    // success
                    getGallery(angular.extend({}, $scope.query));

                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Response Server')
                        .textContent('Data successfully deleted!')
                        .ariaLabel('Response')
                        .ok('Ok!')
                    )
                    .then(function(answer) {

                    });

                },
                function(response) { // optional

                    getGallery(angular.extend({}, $scope.query));

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
  .controller('GalleryEditCtrl', function ($scope, $element,$http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {

    var currentUser = Auth.getCurrentUser();

    $http.get('/api/user_activities/modul/Gallery').then(function (ua) {

        $scope.activities = ua.data;

    });

    socket.forward('connect', $scope);
    socket.forward('activity:modul:gallery', $scope);

    $scope.$on('socket:activity:modul:gallery', function(env, data){

      $scope.activities = data;

    });

    $scope.param = $stateParams.id;

    $scope.$watch('files.length',function(newVal,oldVal){
         console.log($scope.files);
    });


    /**get province*/
    $http.get('/api/provinces/0/1/-name/-').then(function (province) {

      $scope.provinces = province.data.data;


    });

    $scope.get_city = function(province){

        /**get city*/
        $http.get('/api/cities/by_province/'+province+'/0/1/-name/-').then(function (city) {

          $scope.cities = city.data.data;

        });

    }


    if(typeof $scope.param != 'undefined'){

      $http.get('/api/galleries/'+$scope.param).then(function (gal) {

        $scope.gallery = gal.data;

        $http.get('/api/typeofservices/-').then(function(typeofservices){

          $scope.typeofservices = typeofservices.data;

        });

        $scope.type_of_service = [];
        $scope.tos_state = [];
        $scope.sla = [];
        $scope.day = [];
        $scope.start_work = [];
        $scope.end_work = [];


        for(var i = 0; i < $scope.gallery.type_of_service.length;i++){

            $scope.type_of_service.push($scope.gallery.type_of_service[i].name);
            $scope.tos_state.push({name : $scope.gallery.type_of_service[i].name, sla : $scope.gallery.type_of_service[i].sla});
            $scope.sla[$scope.gallery.type_of_service[i].name] = $scope.gallery.type_of_service[i].sla;

        }

        for(var i = 0; i < $scope.gallery.open_days.length;i++){

            $scope.day[i] = $scope.gallery.open_days[i].day;
            $scope.start_work[i] = $scope.gallery.open_days[i].start_work;
            $scope.end_work[i] = $scope.gallery.open_days[i].end_work;

        }

        /**get city*/
        $http.get('/api/cities/by_province/'+gal.data.province).then(function (city) {

          $scope.cities = city.data;

        });

      },function(data) {

         $location.path('/gallery');

      });

      $scope.update_gallery = function(form) {
          $scope.progress();
          $scope.gallery.id = $scope.param;

          var formData = new FormData();
          var tosmodel = [];
          var odmodel = [];

          for(var i = 0; i < $scope.gallery.type_of_service.length;i++){

            tosmodel.push({name : $scope.gallery.type_of_service[i].name, sla : $scope.sla[$scope.gallery.type_of_service[i].name]});

          }

          for(var i = 0; i < $scope.gallery.open_days.length;i++){

            if(typeof $scope.day[i] != 'undefined'){
              odmodel.push({ day : $scope.day[i], start_work : moment($scope.start_work[i]).format('HH:mm'), end_work : moment($scope.end_work[i]).format('HH:mm')});
            }

          }

          formData.append('id',$scope.param);
          formData.append('name',$scope.gallery.name);
          formData.append('address',$scope.gallery.address);
          formData.append('latitude',$scope.gallery.latitude);
          formData.append('longitude',$scope.gallery.longitude);
          formData.append('type_of_service',JSON.stringify(tosmodel));
          formData.append('city',$scope.gallery.city);
          formData.append('province',$scope.gallery.province);
          formData.append('counter_count',$scope.gallery.counter_count);
          formData.append('running_text',$scope.gallery.running_text);
          formData.append('promo',$scope.gallery.promo);
          formData.append('active',$scope.gallery.active);
          formData.append('open_days',JSON.stringify(odmodel));
          formData.append('user_op',currentUser.nik);

          var i = 0;
          var files = [];
          angular.forEach($scope.files,function(obj){

              formData.append('files['+i+']', obj.lfFile);

              i++;

          });

          $http.post('/api/galleries/update', formData, {
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
        controller: 'GalleryCtrl',
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
    $scope.setSLA = function(tos){

      var new_state = [];

      for(var i = 0; i < tos.length; i++){

          var gal = $scope.tos_state.filter(function(a){ return a.name == tos[i] })[0];

          if(gal){
            new_state.push({ name : gal.name, sla : gal.sla });
          }else{
            new_state.push({ name : tos[i], sla : '' });
          }


      }

      $scope.gallery.type_of_service = new_state;


    }
    $scope.addNewDay = function(){

      $scope.gallery.open_days.push({ day: "", start_work: "", end_work: ""});

    }
    $scope.removeDayRow = function(index){

      $scope.gallery.open_days.splice(index, 1);

    }
    $scope.removeImage = function(index){


      $http.get('/api/galleries/delete_cover/'+ index + "/" + $scope.param).then(function (gallery) {

        $scope.gallery.picture.splice( index, 1 );
        console.log(gallery.data);

      });

    }
    $scope.redirect_back = function(){

        $location.path('/gallery');

    }
  })
  .controller('GalleryAddCtrl', function ($scope, $http, socket, $mdToast, $stateParams, $mdDialog, Auth, $location,  $timeout, $log) {
    
      var currentUser = Auth.getCurrentUser();

      $http.get('/api/user_activities/modul/Gallery').then(function (ua) {

          $scope.activities = ua.data;

      });

      socket.forward('connect', $scope);
      socket.forward('activity:modul:gallery', $scope);

      $scope.$on('socket:activity:modul:gallery', function(env, data){

        $scope.activities = data;

      });

      $scope.sla = [];
      $scope.day = [];
      $scope.start_work = [];
      $scope.end_work = [];
      $scope.open_days = [{ day : '', start_work : '', end_work : ''}];

      /**get province*/
      $http.get('/api/provinces/0/1/-name/-').then(function (province) {

        $scope.provinces = province.data.data;

      });

      $scope.get_city = function(province){

          /**get city*/
          $http.get('/api/cities/by_province/'+province+'/0/1/-name/-').then(function (city) {

            $scope.cities = city.data.data;

          });

      }

      $http.get('/api/typeofservices/-').then(function(typeofservices){

        $scope.typeofservices = typeofservices.data;

      });

      $scope.add_gallery = function(form) {

          $scope.progress();

          var formData = new FormData();
          var tosmodel = [];
          var odmodel = [];

          for(var i = 0; i < $scope.type_of_service.length;i++){

             tosmodel.push({name : $scope.type_of_service[i], sla : $scope.sla[$scope.type_of_service[i]]});

          }

          for(var i = 0; i < $scope.open_days.length;i++){

            if(typeof $scope.day[i] != 'undefined'){
              odmodel.push({ day : $scope.day[i], start_work : moment($scope.start_work[i]).format('HH:mm'), end_work : moment($scope.end_work[i]).format('HH:mm')});
            }

          }

          formData.append('name',$scope.gallery.name);
          formData.append('address',$scope.gallery.address);
          formData.append('latitude',$scope.gallery.latitude);
          formData.append('longitude',$scope.gallery.longitude);
          formData.append('type_of_service',JSON.stringify(tosmodel));
          formData.append('city',$scope.gallery.city);
          formData.append('province',$scope.gallery.province);
          formData.append('counter_count',$scope.gallery.counter_count);
          formData.append('running_text',$scope.gallery.running_text);
          formData.append('promo',$scope.gallery.promo);
          formData.append('active',$scope.gallery.active);
          formData.append('open_days',JSON.stringify(odmodel));
          formData.append('user_op',currentUser.nik);

          var i = 0;
          var files = [];
          angular.forEach($scope.files,function(obj){

              formData.append('files['+i+']', obj.lfFile);

              i++;

          });

          $http.post('/api/galleries', formData, {
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
                  $location.path('/gallery');
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
        controller: 'GalleryCtrl',
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

    $scope.addNewDay = function(){

      $scope.open_days.push({ day: "", start_work: "", end_work: ""});

    }
    $scope.removeDayRow = function(index){

      $scope.open_days.splice(index, 1);

    }
    $scope.redirect_back = function(){

        $location.path('/gallery');

    }
  });
