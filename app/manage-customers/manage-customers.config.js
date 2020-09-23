(function() {
    'use strict';

    angular
        .module('managecustomers')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-customers', {
            url: '/manage-customers',
            templateUrl: 'app/manage-customers/manage-customer/manage-customer.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageCustomerController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageCustomer']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Manage Customers',
            icon: 'zmdi zmdi-accounts-alt',
            permission: 'manageCustomer',
            state: 'triangular.manage-customers',
            type: 'link',
            priority: 3.1,
        });
    }
})();
