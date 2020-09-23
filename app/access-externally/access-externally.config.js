(function() {
    'use strict';

    angular
        .module('access-externally')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider) {
        $stateProvider
        .state('external', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/access-externally/layouts/access-externally.tmpl.html'
                }
            }
        })
        .state('external.fill-price', {
            url: '/supplier-fill-price/:spid/:rqid',
            templateUrl: 'app/access-externally/supplier/fill-price/fill-price.tmpl.html',
            controller: 'SupplierFillPriceController',
            controllerAs: 'vm'

        })
        .state('external.view-product', {
            url: '/view-product/:pid',
            templateUrl: 'app/access-externally/product/vew-product/view-product.tmpl.html',
            controller: 'ViewProductController',
            controllerAs: 'vm'

        })
    }
})();