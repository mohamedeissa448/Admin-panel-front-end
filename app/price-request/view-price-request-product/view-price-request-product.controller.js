(function() {
    'use strict';

    angular
        .module('pricerequest')
        .controller('viewPriceRequestProduct', viewPriceRequestProduct);

    /* @ngInject */
    function viewPriceRequestProduct( $mdToast,$mdDialog, triLoaderService,$http, ItemToEdit) {
        var vm = this;
        //vm.requestPriceData =ItemToEdit;
        vm.ProductData = ItemToEdit.RequestPrice_Product;
        vm.ProductData.forEach(function(item,index) {
            item.Product_Name = ItemToEdit.Product[index].Product_Name;
            item.Weight_Name = ItemToEdit.Weight[index].Weight_Name
        });

        vm.ClosemdDialog = function(){
            $mdDialog.hide();
        }
    }
})();