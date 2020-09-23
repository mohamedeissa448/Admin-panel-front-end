(function () {
    'use strict';

    angular
        .module('sendoffer')
        .controller('ViewSendOffer', ViewSendOffer);

    /* @ngInject */
    function ViewSendOffer($mdToast, $mdDialog, triLoaderService, $http, ItemToEdit) {
        var vm = this;
        vm.SendOfferData = ItemToEdit;
        vm.ClosemdDialog = function () {
            $mdDialog.hide();
        }
    }
})();