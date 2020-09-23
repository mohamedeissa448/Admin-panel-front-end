(function() {
    'use strict';

    angular
        .module('managecompanies')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.manage-companies', {
            url: '/manage-companies',
            templateUrl: 'app/company/manage-companies/manage-companies.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageCompanyController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageCompanies']
                }
            }
        })
        .state('triangular.manage-branches', {
            url: '/manage-branches',
            templateUrl: 'app/company/manage-branches/manage-branches.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageBranchController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageBranches']
                }
            }
        })
        .state('triangular.manage-inventories', {
            url: '/manage-inventories',
            templateUrl: 'app/company/manage-inventories/manage-inventories.tmpl.html',
            // set the controller to load for this page
            controller: 'ManageInventoryController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageInventories']
                }
            }
        })
       
       
        triMenuProvider.addMenu({
            name: 'Companies',
            icon: 'fa fa-cogs',
            permission: 'manageCompanies',
            type: 'dropdown',
            priority: 8.1,
            children: [
                {
                    name: 'Manage Companies',
                    state: 'triangular.manage-companies',
                    permission: 'manageCompanies',
                    type: 'link'
                },
                {
                    name: 'Manage Branches',
                    state: 'triangular.manage-branches',
                    permission: 'manageBranches',
                    type: 'link'
                },
                {
                    name: 'Manage Inventories',
                    state: 'triangular.manage-inventories',
                    permission: 'manageInventories',
                    type: 'link'
                },
                   
            ]
        });
    }
})();
