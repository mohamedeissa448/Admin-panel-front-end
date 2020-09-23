(function() {
    'use strict';

    angular
        .module('manageproduct')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-product', {
            url: '/manage-product',
            templateUrl: 'app/manage-product/manage-product/manage-product.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageProductController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageProduct']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Manage Products',
            icon: 'fa fa-dropbox',
            permission: 'manageProduct',
            state: 'triangular.manage-product',
            type: 'link',
            priority: 3.1,
        });
    }
})();
