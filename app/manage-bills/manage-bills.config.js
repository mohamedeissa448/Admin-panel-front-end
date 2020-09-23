(function() {
    'use strict';

    angular
        .module('manage-bills')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-supplier-bills', {
            url: '/system-setup/manage-supplier-bills',
            templateUrl: 'app/manage-bills/manage-supplier-bills/manage-supplier-bills.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageSupplierBillsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                   // only: ['SystemSetup']
                }
            }
        })
      
        .state('triangular.manage-supplier-return-bills', {
            url: '/system-setup/manage-supplier-return-bills',
            templateUrl: 'app/manage-bills/manage-supplier-return-bills/manage-supplier-return-bills.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageSupplierReturnBillsController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                   // only: ['SystemSetup']
                }
            }
        })
        

        triMenuProvider.addMenu({
            name: "Manage Suppliers' Bills ",
            icon: 'fa fa-cogs',
           // permission: 'SystemSetup',
            type: 'dropdown',
            priority: 4.1,
            children: [
                {
                    name: "Suppliers' Bills",
                    state: 'triangular.manage-supplier-bills',
                   // permission: 'SystemSetup',
                    type: 'link'
                },
                {
                    name: "Suppliers' Return Bills",
                    state: 'triangular.manage-supplier-return-bills',
                   // permission: 'SystemSetup',
                    type: 'link'
                },
                
               
                
            ]
        });
    }
})();
