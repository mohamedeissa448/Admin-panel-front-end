(function() {
    'use strict';

    angular
        .module('managesuppliers')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-suppliers', {
            url: '/manage-suppliers',
            templateUrl: 'app/manage-suppliers/manage-supplier/manage-suppliers.tmpl.html',
            // set the controller to load for this page
            controller: 'ManagesuppliersController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageSuppliers']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Manage Suppliers',
            icon: 'fa fa-truck',
            permission: 'manageSuppliers',
            state: 'triangular.manage-suppliers',
            type: 'link',
            priority: 4.1,
        });
    }
})();
