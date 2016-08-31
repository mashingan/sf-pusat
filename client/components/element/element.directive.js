'use strict';

/**
 * @ngdoc directive
 * @name ignsaWebappApp.directive:elements
 * @description
 * # elements
 */
angular.module('smartfrenApp')
  .directive('goEmpty', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<div/>',
      link: function (s, element, attr) {
        element.css({
          width: attr.width,
          height: attr.height
        })
      }
    }
  })

  .directive('goPadding', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function (s, element, attr) {
        element.css({
          'padding-top': attr.top||attr.all,
          'padding-bottom': attr.bottom||attr.all,
          'padding-left': attr.left||attr.all,
          'padding-right': attr.right||attr.all
        })
      }
    }
  })

  .directive('goBackgroundImage',function($timeout){
    return{
      restrict:'A',
      replace:false,
      link:function(scope,element,attr){
        $timeout(function(){
          element.css({
            'background-image':'url('+attr.goBackgroundImage+')',
            'background-size':'cover'
          })
        })
      }
    }
  })

  .directive('charLimit', function(){
    return {
      restrict:'A',
      replace:'false',
      scope:{
        maxchar:'@maxchar',
        body:'@body'
      },
      link: function(scope, element, attr) {
        function limitChar(text){
          return text.substr(0,attr.charLimit)+'..';
        }

        element.append(limitChar(scope.body));

      }
    }
  })

  .directive('setPosition',function(){
    return{
      replace:false,
      restrict:'A',
      link:function(scope,element,attrs){
        if(attrs.to == 'TL')
          element.css({
            position:attrs.setPosition,
            top:attrs.top,
            left:attrs.left
          });
        else if(attrs.to == 'BL')
          element.css({
            position:attrs.setPosition,
            bottom:attrs.bottom,
            left:attrs.left
          });
        else if(attrs.to == 'BR')
          element.css({
            position:attrs.setPosition,
            bottom:attrs.bottom,
            right:attrs.right
          });
        else if(attrs.to == 'TR')
          element.css({
            position:attrs.setPosition,
            top:attrs.top,
            right:attrs.right
          });
      }
    }
  })

  .directive('goCardContainer',function($window,$timeout){
    return{
      replace:false,
      restrict:'A',
      scope:{
        ctrl:'='
      },
      link:function(scope,element,attrs){
        //angular.element($window).bind('resize',function(){
        //  checkingViewport();
        //});

        function checkingViewport(){
          var innerWidth = element.innerWidth();
          if(innerWidth >= 1280){scope.ctrl.maxRow = 4}
          else if(innerWidth >= 960){scope.ctrl.maxRow = 3}
          else if(innerWidth >= 600){scope.ctrl.maxRow = 2}
          else{scope.ctrl.maxRow = 1};

        }

        //checkingViewport();
        $timeout(function(){
          checkingViewport()
        })
      }
    }
  })

  .directive('goProgressCircular',function($compile){
    return {
      restrict:'E',
      replace:true,
      template:'<md-content flex layout layout-align="center center"/>',
      scope:{
        watch:'=',
      },
      link:function(s,element,attr){
        var diameter = attr.diameter || 48;
        var progressCircular = angular.element('<md-progress-circular class="md-hue-2" md-diameter="'+attr.diameter+'" md-mode="indeterminate"></md-progress-circular>');
        element.append($compile(progressCircular)(s));
      }
    }
  })

  .directive('goCenterMessage',function(){
    return {
      restrict:'E',
      replace:true,
      template:'<md-content class="go-center-message" flex layout layout-align="center center"/>',
      link:function(s,element,attr){
      }
    }
  })

  .directive('constraint',function(){
    return {
      restrict:'A',
      link:function(scope,element,attrs){
        switch(attrs.constraint){
          case 'height':
                var _width = Number(element.css('height').replace('px',''))*1.4;
                var _borderRadius = _width/2+'px/'+_width/2.75+'px';
                element.css({
                  'width':_width,
                  'border-radius':_borderRadius
                });
                break;
          case 'width':
                var _width = element.css('width');
                element.css('height',_width);
                break;
        }
      }
    }
  })

