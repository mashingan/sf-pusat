'use strict';

angular.module('smartfrenApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ngMaterial',
  'ngMessages',
  'sasrio.angular-material-sidenav',
  'pjTts',
  'digitalbs',
  'md.data.table',
  'ceibo.components.table.export',
  'highcharts-ng',
  'ncy-angular-breadcrumb',
  'ngMaterialDatePicker',
  'vsGoogleAutocomplete',
  'ngTagsInput',
  'lfNgMdFileInput',
  'textAngular',
  'ds.clock',
  'AngularPrint',
  'angular-virtual-keyboard'
])
  .config(function ($breadcrumbProvider,$stateProvider,AuthProvider, $urlRouterProvider, ssSideNavSectionsProvider, $locationProvider, $httpProvider, $mdThemingProvider) {
    
    $breadcrumbProvider.setOptions({
      template: '<div>Queueing System <span ng-repeat="step in steps"> > {{step.ncyBreadcrumbLabel}}</span></div>'
    });

    $urlRouterProvider
      .otherwise('/');

    var neonRedMap = $mdThemingProvider.extendPalette('red', {
      '500': 'ff0000'
    });

    

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('neonRed', neonRedMap);
    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
    .primaryPalette('neonRed')

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');


    var currentUser = AuthProvider.$get().getCurrentUser();

    if(currentUser.$promise){
      currentUser.$promise.then(function(user){
          ssSideNavSectionsProvider.initWithTheme($mdThemingProvider);
          ssSideNavSectionsProvider.initWithSections([
            {
              id: 'toogle_1',
              name: 'Queueing System',
              type: 'heading',
              children: [
                {
                  id: 'dashboard',
                  name: 'Dashboard',
                  state: 'admin',
                  type: 'link',
                  icon: 'fa fa-bar-chart'

                },
                {
                  id: 'server_monitor',
                  name: 'Server Monitor',
                  state: 'server_monitor',
                  type: 'link',
                  icon: 'fa fa-tachometer'

                },
                {
                  name: 'Report',
                  type: 'toggle',
                  icon: 'fa fa-tasks fix-margin',
                  pages: [{
                      id: 'rpt_1',
                      name: 'Productivity National',
                      state: 'rpt_productivity_national'
                  }, {
                      id: 'rpt_2',
                      name: 'Productivity Gallery',
                      state: 'rpt_productivity_gallery'
                  }, {
                      id: 'rpt_3',
                      name: 'Queueing Transaction',
                      state: 'rpt_queueing_transaction'
                  }, {
                      id: 'rpt_4',
                      name: 'Type Of Service Transaction',
                      state: 'rpt_type_of_service_transaction'
                  }]
                },
                {
                  name: 'Configuration',
                  type: 'toggle',
                  icon: 'fa fa-cogs fix-margin',
                  pages: [{
                    id: 'config_1',
                    name: 'Email SMTP',
                    state: 'smtp_gmail_config'
                },{
                    id: 'config_2',
                    name: 'Email Template',
                    state: 'template_email_config',
                },{
                    id: 'config_3',
                    name: 'Zsmart API',
                    state: 'zsmart_api_config'
                },{
                    id: 'config_4',
                    name: 'Gallery',
                    state: 'gallery_config'
                }
              ]
            },
            {
                name: 'Data Master',
                type: 'toggle',
                icon: 'fa fa-pencil-square-o fix-margin',
                pages: [{
                    id: 'man_1',
                    name: 'Gallery',
                    state: 'gallery'
                  }, {
                    id: 'man_2',
                    name: 'Type of Service',
                    state: 'typeofservice'
                  }, {
                    id: 'man_3',
                    name: 'Handset Type',
                    state: 'handsettype'
                  }, {
                    id: 'man_4',
                    name: 'Tagging Transaction',
                    state: 'tagging_transaction'
                  }, {
                    id: 'man_5',
                    name: 'City',
                    state: 'city'
                  }, {
                    id: 'man_6',
                    name: 'Province',
                    state: 'province'
                  }, {
                    id: 'man_7',
                    name: 'Role',
                    state: 'role'
                  }, {
                    id: 'man_8',
                    name: 'User',
                    state: 'user'
                  }
                  ]
                }
              ]
            }
          ]);
      });
    }

  })
  .config(function(VKI_CONFIG){
      console.log(VKI_CONFIG)
      VKI_CONFIG.layout.Numerico = {
        'name': "Numerico", 'keys': [
          [["1", '1'], ["2", "2"], ["3", "3"], ["Bksp", "Bksp"]],
          [["4", "4"], ["5", "5"], ["6", '6'], ["Enter", "Enter"]],
          [["7", "7"], ["8", "8"], ["9", "9"], []],
          [[],["0", "0"], [],[]]
        ], 'lang': ["pt-BR-num"] };

      VKI_CONFIG.layout.Letter = {
        'name': "Letter", 'keys': [
          [[], ["q", "Q"], ["w", "W", "?"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["Enter", "Enter"]],
          [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"],[]],
          [["Shift", "Shift"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], ["Shift", "Shift"]],
          [[" ", " ", " ", " "]]
        ], 'lang': ["pt-EN-num"] };

    })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {

        if(response.status === 401) {
          $location.path('/manageLogin');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }

      }
    };
  })

  .config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
      .primaryPalette('red')
      .accentPalette('amber',{
        'default':'600'
      });

    $mdThemingProvider.theme('light')
      .backgroundPalette('grey',{
        'default':'50',
        'hue-1':'100',
        'hue-2':'300'
      });

    $mdThemingProvider.theme('dark')
      .primaryPalette('grey',{
        'default':'50'
      })
      .accentPalette('amber',{
        'default':'600'
      })
      .backgroundPalette('red',{
        'default':'800'
      }).dark();

    $mdThemingProvider.theme('grey')
      .primaryPalette('grey',{
        'default':'50'
      });
  })

  .config(function($stateProvider){
    $stateProvider.state('site',{
      url:''
    })
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
     
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/manageLogin');
        }
      });
      
    });
  });
