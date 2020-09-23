(function() {
    'use strict';

    angular
        .module('pricerequest')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.price-request', {
            url: '/manage-price-request',
            templateUrl: 'app/price-request/manage-price-request/manage-price-request.tmpl.html',
            controller: 'ManagePriceRequestController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['managePriceRequest']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Price Request',
            icon: 'fa fa-usd',
            type: 'link',
            permission: 'managePriceRequest',
            state: 'triangular.price-request',
            priority: 2.3,
        });
    }
})();
