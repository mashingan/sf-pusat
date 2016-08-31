/**
 * Created by dwiargo on 3/15/16.
 */

'use strict';

angular.module('digitalbs',['digitalbs.speech'])
  .service('Speech',function($timeout,speech){
    var lang = {
      de:64,
      en_us:65,
      en_uk_female:66,
      en_uk_male:67,
      es:68,
      es_de:69,
      fr:70,
      in:71,
      id:72,
      it:73
    }
    return {
      tts:function(text,config){
        $timeout(function(){
          var voices = speech.getVoices();
          if(window.speechSynthesis){
            speech.sayText(text,{
              voiceIndex:lang[config.lang]||64,
              volume:config.volume||1,
              pitch:config.pitch||1,
              rate:config.rate||1
            })
          }
        },500)
      }
    }
  })
