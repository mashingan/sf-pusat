/**
 * Created by dwiargo on 5/9/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('Utils',function(){
    return {
      eventFire: function (el, etype) {
        if (el.fireEvent) {
          el.fireEvent('on' + etype);
        } else {
          var evObj = document.createEvent('Events');
          evObj.initEvent(etype, true, false);
          el.dispatchEvent(evObj);
        }
      }
    }
  })