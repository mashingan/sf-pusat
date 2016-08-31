/**
 * Created by dwiargo on 5/16/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('KioskQrcodeCtrl', function ($scope, $mdDialog, $timeout, KioskService) {
    var webcamHasOpen = false;

    $scope.set = ''

    //INIT
    function init() {
      $timeout(function(){
        openWebCam();
      },500)
    }

    function openWebCam() {
      var el = $('#reader');

      console.log(el.html5_qrcode)

      el.html5_qrcode(function (data) {
        webcamHasOpen = true;
        if (data) {
          $timeout(function(){
            $scope.set = data;
          })
        }
      }, function (error) {
        console.log(error)
      }, function (videoError) {
        console.log(videoError);
      });

    }

    function closeWebcam() {
      if (webcamHasOpen) {
        var el = $('#reader');
        el.html5_qrcode_stop();
        $('video').remove();
        $('#qr-canvas').remove();
      }
    }

    init();
    //##

    //SUBMIT
    $scope.submit = function () {
      closeWebcam();
      $timeout(function(){
        $mdDialog.hide({book_code:$scope.set});
      },500)
    };
    //##

    //CANCEL
    $scope.cancel = function () {
      closeWebcam();
      $timeout(function(){
        $mdDialog.cancel();
      },500)
    };

    //##
  })
