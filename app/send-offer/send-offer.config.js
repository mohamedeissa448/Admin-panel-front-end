(function() {
    'use strict';

    angular
        .module('sendoffer')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.send-offer', {
            url: '/manage-send-offer',
            templateUrl: 'app/send-offer/manage-send-offer/manage-send-offer.tmpl.html',
            controller: 'ManageSendOfferController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['manageCustomerOffer']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Customer Offer',
            icon: 'zmdi zmdi-email',
            type: 'link',
            permission: 'manageCustomerOffer',
            state: 'triangular.send-offer',
            priority: 2.4,
        });
    }
})();
