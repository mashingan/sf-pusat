'use strict';

angular.module('smartfrenApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Dashboard'
        }
      })
      .state('server_monitor', {
        url: '/server_monitor',
        templateUrl: 'app/admin/server_monitor.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Dashboard'
        }
      })
      .state('user', {
        url: '/user',
        templateUrl: 'app/admin/user/user.html',
        controller: 'UserCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'User'
        }
      })
      .state('user_edit', {
        url: '/user/edit/:id',
        templateUrl: 'app/admin/user/user_edit.html',
        controller: 'UserCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'user'
        }
      })
      .state('user_add', {
        url: '/user/add',
        templateUrl: 'app/admin/user/user_add.html',
        controller: 'UserCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'user'
        }
      })
      .state('gallery', {
        url: '/gallery',
        templateUrl: 'app/admin/gallery/gallery.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Gallery'
        }
      })
      .state('socket', {
        url: '/socket',
        templateUrl: 'app/admin/socket/socket.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Socket'
        }
      })
      .state('gallery_edit', {
        url: '/gallery/edit/:id',
        templateUrl: 'app/admin/gallery/gallery_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'gallery'
        }
      })
      .state('gallery_add', {
        url: '/gallery/add',
        templateUrl: 'app/admin/gallery/gallery_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'gallery'
        }
      })
      .state('typeofservice', {
        url: '/typeofservice',
        templateUrl: 'app/admin/type_of_service/typeofservice.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Type of Service'
        }
      })
      .state('typeofservice_edit', {
        url: '/typeofservice/edit/:id',
        templateUrl: 'app/admin/type_of_service/typeofservice_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'typeofservice'
        }
      })
      .state('typeofservice_add', {
        url: '/typeofservice/add',
        templateUrl: 'app/admin/type_of_service/typeofservice_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'typeofservice'
        }
      })
      .state('skillset', {
        url: '/skillset',
        templateUrl: 'app/admin/skillset/skillset.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Skillset'
        }
      })
      .state('skillset_edit', {
        url: '/skillset/edit/:id',
        templateUrl: 'app/admin/skillset/skillset_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'skillset'
        }
      })
      .state('skillset_add', {
        url: '/skillset/add',
        templateUrl: 'app/admin/skillset/skillset_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'skillset'
        }
      })
      .state('city', {
        url: '/city',
        templateUrl: 'app/admin/city/city.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'City'
        }
      })
      .state('city_edit', {
        url: '/city/edit/:id',
        templateUrl: 'app/admin/city/city_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'city'
        }
      })
      .state('city_add', {
        url: '/city/add',
        templateUrl: 'app/admin/city/city_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'city'
        }
      })
      .state('province', {
        url: '/province',
        templateUrl: 'app/admin/province/province.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Province'
        }
      })
      .state('province_edit', {
        url: '/province/edit/:id',
        templateUrl: 'app/admin/province/province_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'province'
        }
      })
      .state('province_add', {
        url: '/province/add',
        templateUrl: 'app/admin/province/province_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'province'
        }
      })
       .state('tagging_transaction', {
        url: '/tagging_transaction',
        templateUrl: 'app/admin/tagging_transaction/tagging_transaction.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Tagging Transaction'
        }
      })
      .state('tagging_transaction_edit', {
        url: '/tagging_transaction/edit/:id',
        templateUrl: 'app/admin/tagging_transaction/tagging_transaction_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'tagging_transaction'
        }
      })
      .state('tagging_transaction_add', {
        url: '/tagging_transaction/add',
        templateUrl: 'app/admin/tagging_transaction/tagging_transaction_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'tagging_transaction'
        }
      })
      .state('handsettype', {
        url: '/handsettype',
        templateUrl: 'app/admin/handset_type/handsettype.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Handset Type'
        }
      })
      .state('handsettype_edit', {
        url: '/handsettype/edit/:id',
        templateUrl: 'app/admin/handset_type/handsettype_edit.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'handsettype'
        }
      })
      .state('handsettype_add', {
        url: '/handsettype/add',
        templateUrl: 'app/admin/handset_type/handsettype_add.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'handsettype'
        }
      })
      .state('role', {
        url: '/role',
        templateUrl: 'app/admin/role/role.html',
        controller: 'RoleCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Role'
        }
      })
      .state('role_edit', {
        url: '/role/edit/:id',
        templateUrl: 'app/admin/role/role_edit.html',
        controller: 'RoleCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Edit',
          parent: 'role'
        }
      })
      .state('role_add', {
        url: '/role/add',
        templateUrl: 'app/admin/role/role_add.html',
        controller: 'RoleCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'New',
          parent: 'role'
        }
      })
      .state('rpt_productivity_national', {
        url: '/rpt_productivity_national',
        templateUrl: 'app/admin/rpt_productivity_national/rpt_productivity_national.html',
        controller: 'RptProductivityNationalCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Productivity National'
        }
      })
       .state('rpt_productivity_gallery', {
        url: '/rpt_productivity_gallery',
        templateUrl: 'app/admin/rpt_productivity_gallery/rpt_productivity_gallery.html',
        controller: 'RptProductivityGalleryCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Productivity Gallery'
        }
      })
      .state('rpt_queueing_transaction', {
        url: '/rpt_queueing_transaction',
        templateUrl: 'app/admin/rpt_queueing_transaction/rpt_queueing_transaction.html',
        controller: 'RptQueueingTransactionCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Queueing Transaction'
        }
      })
      .state('rpt_type_of_service_transaction', {
        url: '/rpt_type_of_service_transaction',
        templateUrl: 'app/admin/rpt_type_of_service_transaction/rpt_type_of_service_transaction.html',
        controller: 'RptTypeOfServiceTransactionCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Type of Service Transaction'
        }
      })
      .state('rpt_agent_breaktime', {
        url: '/rpt_agent_breaktime',
        templateUrl: 'app/admin/rpt_agent_breaktime/rpt_agent_breaktime.html',
        controller: 'RptAgentBreaktimeCtrl',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Agent Breaktime'
        }
      })
      .state('smtp_gmail_config', {
        url: '/smtp_gmail_config',
        templateUrl: 'app/admin/configuration/smtp_email.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'SMTP Gmail Configuration'
        }
      })
      .state('template_email_config', {
        url: '/template_email_config',
        templateUrl: 'app/admin/configuration/template_email.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Template Email'
        }
      })
      .state('template_email_activation_config', {
        url: '/template_email_activation_config',
        templateUrl: 'app/admin/configuration/template_activation_email.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Template Email Activation'
        }
      })
      .state('template_sms', {
        url: '/template_sms',
        templateUrl: 'app/admin/configuration/template_sms.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Template SMS'
        }
      })
      .state('zsmart_api_config', {
        url: '/zsmart_api_config',
        templateUrl: 'app/admin/configuration/zsmart_api.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Zsmart API URL'
        }
      })
      .state('gallery_config', {
        url: '/gallery_config',
        templateUrl: 'app/admin/configuration/gallery.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Gallery Config'
        }
      })
      .state('system', {
        url: '/system',
        templateUrl: 'app/admin/configuration/system.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'System Config'
        }
      })
      .state('version', {
        url: '/version',
        templateUrl: 'app/admin/configuration/version.html',
        authenticate: true,
        ncyBreadcrumb: {
          label: 'Version Control'
        }
      });
  });
