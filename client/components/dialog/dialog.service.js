/**
 * Created by dwiargo on 2/7/16.
 */

angular.module('smartfrenApp')
  .value('DialogValue',{
    post:null
  })
  .factory('Dialog',function($mdToast,$mdDialog,$compile,DialogValue){
    return {
      showToast:function(params){
        var cb = params.callback || angular.noop;
        var dl = params.delay || 3000;
        if(params.delay == 'lock') dl = null;
        $mdToast.show(
          $mdToast.simple()
            .content(params.message||'no messages')
            .hideDelay(dl)
            .position(params.position||'bottom left')
            .action(params.action||angular.noop)
        ).then(function(response){
            if(response == 'ok'){
              cb();
            }
          })
      },
      hideToast:function(){
        $mdToast.hide();
      },
      showDialog:function(params){

        var confirm = $mdDialog.confirm()
          .parent(angular.element(document.querySelector('#main-view')))
          .title(params.title||'Alert')
          .content(params.content||'No Messages')
          .ariaLabel(params.title||'Alert')
          .ok(params.confirmLabel || 'Ok')
          .cancel(params.cancelLabel || 'Cancel');

        var confirmed = params.onConfirm || angular.noop;
        var canceled = params.onCancel || angular.noop;

        $mdDialog.show(confirm).then(confirmed,canceled)
      },
      showDialogTemplate:function(params){
        var cb = params.submit || angular.noop;
        var ctrl = params.controller || angular.noop;
        DialogValue.body = angular.copy(params.body);

        $mdDialog.show({
          controller:ctrl,
          templateUrl:params.templateUrl,
          parent:angular.element(document.body),
        }).then(function(set){
          cb(set);
        });
      },
      floatingMenu:function(s,menu,event){
        var parent = angular.element(document.body);
        var x = event.pageX+'px';
        var y = event.pageY+'px';
        parent.append($compile('<go-floating-menu menu="'+menu+'" left='+x+' top='+y+'/>')(s))
      }
    }
  })

  .service('buildToggler',function($mdSidenav,$timeout,$log){
    function debounce(func, wait, scope,context) {
      var timer;
      function debounced() {
        var context = scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };

      return debounced();
    }

    function start(scope,navID) {
      return debounce(function() {
        $mdSidenav(navID).
          toggle().
          then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200,scope);
    };

    return {
      start:start
    };
  })
