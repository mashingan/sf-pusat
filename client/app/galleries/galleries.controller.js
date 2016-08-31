/**
 * Created by dwiargo on 4/18/16.
 */

'use strict';

angular.module('smartfrenApp')
  .controller('GalleriesCtrl', function ($scope, $state, GalleriesService, $stateParams) {
    $scope.logo = 'assets/images/logo-white.png';
    $scope.smartfren4G = 'assets/images/smartfren4G-l.png';
    $scope.sinarmas = 'assets/images/sinarmas-l.png';
    $scope.filter = '';
    $scope.defaultPicture = 'http://localhost:9000/media/gallery/default_gallery.jpg'

    //INIT
    function init(){
      loadData();
    }

    function loadData(){
      GalleriesService.list().then(function(response){
        $scope.galleries = response.data.data;
      })
    }

    init();
    //##

    //SELECT
    $scope.selectGalleries = function(item){
      $state.go($stateParams.target,{galleryId:item.id,galleryName:item.name})
    }
    //##
  });
