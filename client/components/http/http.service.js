/**
 * Created by dwiargo on 2/18/16.
 */

'use strict';

angular.module('smartfrenApp')
  .service('Http',function($http,$q){
    function request(params){
      var deferredAbort = $q.defer();
      var config = {
        method:params.method,
        url:params.url,
        data:params.data,
        params:params.data,
        ignoreLoadingBar:params.ignoreLoadingBar,
        timeout:deferredAbort.promise,
        headers:{}
      }

      if(params.headers){
        //config.headers = {};
        //headers type====================
        if(params.headers.type)
          switch(headers.type){
            case 'x-auth-token':
              config.headers['x-auth-token'] = params.headers.token;
              break;
            default:
              config.headers['Authorization'] = params.headers.token;
              break;
          };
        //--------------------------------

        //Content Type====================
        if(params.headers.contentType)
          config.headers["Content-Type"] = params.headers.contentType;
        //--------------------------------
      }

      var request = $http(config);


      var promise = request.then(
        function(response){
          return (response);
        },
        function(response){
          return ($q.reject(response));
        }
      )

      promise.abort = function(){
        deferredAbort.resolve();
      }

      promise.finally(
        function(){
          promise.abort = angular.noop;
          deferredAbort = request = promise = null;
        }
      )

      return promise;
    }

    return {
      request:request
    }
  })

  .service('RequestHandler',function(Dialog){
    return{
      onError:function(response){
        if(response.status == -1){
          response.message = 'Failed to connect. Check your internet connection!';
        }
        Dialog.showToast({message:response.message || response.data.message || response.statusText || response.data || response});
      }
    }
  })
