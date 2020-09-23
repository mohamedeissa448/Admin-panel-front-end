(function() {
    'use strict';

    angular
        .module('manageuser')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-user', {
            url: '/manage-user',
            templateUrl: 'app/manage-user/search-user/search-user.tmpl.html',
            // set the controller to load for this page
            controller: 'SearchUserController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageUsers']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Manage Users',
            icon: 'zmdi zmdi-accounts',
            permission: 'manageUsers',
            state: 'triangular.manage-user',
            type: 'link',
            priority: 8.1,
        });

    }
})();
