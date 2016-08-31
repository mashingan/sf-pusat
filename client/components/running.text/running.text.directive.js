/**
 * Created by dwiargo on 3/8/16.
 */

'use strict';

angular.module('smartfrenApp')
  .directive('runningText',function($interval,$timeout){
    return {
      restrict:'E',
      replace:true,
      template:'<div class="running-text"/>',
      scope:{
        runningTextData:'='
      },
      link:function(scope,element,attr){
        var idx = 0;
        var moving = [];
        var add = true;
        var margin = attr.runningTextMargin || 16;

        $interval(function(){
          for(var i = moving.length - 1 ; i >= 0 ; i--) {
            var d = moving[i];
            d.pos -= attr.runningTextSpeed || 1;
            var pos = d.pos + 'px';
            d.elm.css({left: pos});

            //add handler
            if (d.pos < (element[0].clientWidth - d.width - margin) && d.addNext) {
              idx += 1;
              addText();
              d.addNext = false;
            }

            //remove handler
            if (d.pos < -d.width) {
              d.elm.remove();
              moving.splice(i, 1);
            }
          }
        },50);

        function addText(){
          if(idx >= scope.runningTextData.length) idx = 0;
          var elm = angular.element('<div class="layout-row"></div>');
          var separator = angular.element('<div class="running-text-separator"></div>');
          separator.css({
            'margin-right':(margin+'px')
          })
          var text = angular.element('<div>'+scope.runningTextData[idx]+'</div>');
          elm.append(separator);
          elm.append(text);
          element.append(elm);

          elm.css({
            position:'absolute',
            bottom:'2px',
            right:0
          });

          var posX = elm[0].offsetWidth *(-1)+'px';
          elm.css({right:posX});

          moving.push({
            elm:elm,
            pos:elm[0].offsetLeft,
            width:elm[0].offsetWidth,
            addNext:true
          });

          add = false;
        }

        $timeout(function(){
          addText();
          add = true
        },500);

      }
    }
  })
