'use strict';

angular.module('smartfrenApp')
  .controller('KioskCtrl', function ($scope, $interval, Dialog, $sce, $stateParams, KioskService, RequestHandler, Utils, $timeout, GalleriesService) {
    /*
     $scope.message = 'Hello';
     $scope.services = [
     {name:"Cashier"},
     {name:"Customer Service"},
     {name:"Experience Zones"},
     {name:"Booking from Mobile App"},
     ];

     //REGISTER
     $scope.register = function(){
     Dialog.showDialogTemplate({
     controller:'KioskDetailRegisterCtrl',
     templateUrl:'app/kiosk/detail/dialog/kiosk.detail.register.html'
     })
     }
     //##

     //VIDEO
     $scope.config = {
     autoPlay:true,
     sources: [
     {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
     {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
     {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
     ],
     tracks: [
     {
     src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
     kind: "subtitles",
     srclang: "en",
     label: "English",
     default: ""
     }
     ]
     };

     $scope.onPlayerReady = function(Api){
     $scope.Api = Api;
     $scope.Api.autoPlay = true;
     }

     $scope.onComplete = function(){
     $timeout(function(){
     Api.play();
     })
     }
     //##

     //RUNNINT TEXT
     $scope.runningTextData = ['Lorem ipsum dolor sit amet','Highly customizable AngularJS directive for numbers naha kitu','This directive may be configured for each input'];
     //##
     */

    $scope.logo = 'assets/images/logo-white.png';
    $scope.logoBlack = 'assets/images/logo-black.png';
    $scope.kwik = 'assets/images/pose tunjuk FA material.png';
    $scope.smartfren4G = 'assets/images/smartfren4G.png';
    $scope.sinarmas = 'assets/images/sinarmas.jpg';

    $scope.mainMenu = true;

    $scope.currentCustomer = {
      queueing_number:'00',
      customer:'-',
      gallery:'-',
      estimated_waiting_time:'-',
      type_of_service:'-'
    };

    //INIT
    function init(){
      getGalleryDetail();
    }

    function getGalleryDetail(){
      GalleriesService.get($stateParams.galleryId).then(function(response){
        $scope.gallery = response.data;
      }, RequestHandler.onError)
    }

    init();
    //##

    //REGISTER
    $scope.register = function (type) {
      $scope.type = type;
      if(type=='qrcode'){
        $scope.registerForm()
      }else{
        $scope.mainMenu = false;
      }
    };

    $scope.registerForm = function(type_of_service){
      switch ($scope.type) {
        case 'nomorSmartfren':
          Dialog.showDialogTemplate({
            controller: 'KioskRegisterCtrl',
            templateUrl: 'app/kiosk/dialog/kiosk.register.html',
            body: {newCustomer: false,type_of_service:type_of_service},
            submit:function(set){
              KioskService.checkMdn(set).then(function(response){
                if(response.data.result == 'failed'){
                  //Dialog.showToast({message:'MDN is not Registered'});
                  Dialog.showDialog({
                    title:'Gagal',
                    content:'MDN tidak terdaftar',
                    submitLabel:'Coba Lagi',
                    submit:function(){
                      $scope.registerForm(type_of_service);
                    },
                    cancelLabel:'Batal'
                  })
                }else {
                  set.name = response.data.name;
                  submitCustomer(set);
                }
              },RequestHandler.onError)
            }
          })
          break;
        case 'pelangganBaru':
          Dialog.showDialogTemplate({
            controller: 'KioskRegisterCtrl',
            templateUrl: 'app/kiosk/dialog/kiosk.register.html',
            body: {newCustomer: true,type_of_service:type_of_service},
            submit:submitCustomer
          });
          break;
        case 'qrcode':
          Dialog.showDialogTemplate({
            controller:'KioskQrcodeCtrl',
            templateUrl:'app/kiosk/dialog/kiosk.qrcode.html',
            submit:function(set){
              KioskService.regQrcode(set).then(function(response){
                if(response.data.result == 'failed'){
                  Dialog.showToast({message:response.data.message});
                }else{
                  $scope.currentCustomer = response.data;
                  print();
                }
              })
            }
          })
          break;
      }
    };

    function submitCustomer(set){
      set.gallery = $stateParams.galleryName;
      KioskService.newCustomer(set).then(function(response){
        $scope.currentCustomer = response.data;
        print();
        $scope.mainMenu = true;
        //$timeout(function(){
        //  var restorePage = document.body.innerHTML;
        //  var printContent = document.getElementById('queuePaper');
        //  document.body.innerHTML = printContent;
        //  window.print();
        //  document.body.innerHTML = restorePage;
        //},2000)

      },RequestHandler.onError)
    }

    function print(){
      $timeout(function(){
        Utils.eventFire(document.getElementById('printBtn'),'click');
      })
    }
    //##

    //BACK
    $scope.back = function(){
      $scope.mainMenu = true;
    }
    //##
  });
