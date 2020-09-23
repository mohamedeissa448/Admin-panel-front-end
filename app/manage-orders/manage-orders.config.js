(function() {
    'use strict';

    angular
        .module('manageorders')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-orders', {
            url: '/manage-orders',
            templateUrl: 'app/manage-orders/orders/orders.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageOrdersController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                   // only: ['manageCustomer']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Manage Orders',
            icon: 'zmdi zmdi-accounts-alt',
           // permission: 'manageCustomer',
            state: 'triangular.manage-orders',
            type: 'link',
            priority: 3.1,
        });
    }
})();
