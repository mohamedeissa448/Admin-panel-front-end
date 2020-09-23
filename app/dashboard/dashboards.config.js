(function() {
    'use strict';

    angular
        .module('dashboard')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.home', {
            url: '/dashboard/home',
            templateUrl: 'app/dashboard/home/home.tmpl.html',
            controller: 'HomeController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['hichemUser']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Dashboard',
            icon: 'fa fa-tachometer',
            state: 'triangular.home',
            type: 'link',
            permission: 'hichemUser',
            priority: 1.1
        });

    }
})();
