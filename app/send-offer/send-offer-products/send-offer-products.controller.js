(function () {
    'use strict';

    angular
        .module('sendoffer')
        .controller('SendOfferProducts', SendOfferProducts);

    /* @ngInject */
    function SendOfferProducts($mdToast, $mdDialog, triLoaderService, $http, ItemToEdit) {
        var vm = this;
        vm.SendOfferData = ItemToEdit;
        console.log(ItemToEdit);  

        vm.SendOfferData.Product.forEach(function(item, index){
            vm.SendOfferData.SendOffer_Product[index].Product_Name = item.Product_Name;
        });
        
        vm.ClosemdDialog = function () {
            $mdDialog.hide();
        };  

    }
})();