(function() {
    'use strict';

    angular
        .module('nonoauthentication')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider) {

        $stateProvider
        .state('authentication', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/authentication/layouts/authentication.tmpl.html'
                }
            }
        })
        .state('authentication.login', {
            url: '/login',
            templateUrl: 'app/authentication/login/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('authentication.lock', {
            url: '/lock',
            templateUrl: 'app/authentication/lock/lock.tmpl.html',
            controller: 'LockController',
            controllerAs: 'vm'
        })
        .state('authentication.forgot', {
            url: '/forgot',
            templateUrl: 'app/authentication/forgot/forgot.tmpl.html',
            controller: 'ForgotController',
            controllerAs: 'vm'
        })
        .state('triangular.change-password', {
            url: '/change-password',
            templateUrl: 'app/authentication/change-password/change-password.tmpl.html',
            controller: 'ChangePasswordController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['hichemUser']
                }
            }
        })
        .state('triangular.profile', {
            url: '/profile',
            templateUrl: 'app/authentication/profile/profile.tmpl.html',
            controller: 'ProfileController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['hichemUser']
                }
            }
        });

    }
})();
