(function () {
    'use strict';

    angular
        .module('pricerequest')
        .controller('ViewPriceRequestDetailsController', ViewPriceRequestDetailsController);

    /* @ngInject */
    function ViewPriceRequestDetailsController($mdToast, $mdDialog, $http, requestPriceData, $filter) {
        var vmr = this;
        vmr.requestPriceData = requestPriceData;
        

        vmr.requestDateString = $filter('date')(vmr.requestPriceData.Valid_Till, "dd MMM yyyy");

        vmr.CloseDetailsWindow = function () {
            $mdDialog.hide(vmr.ViewDetailsWindow);
        }
    };
})();