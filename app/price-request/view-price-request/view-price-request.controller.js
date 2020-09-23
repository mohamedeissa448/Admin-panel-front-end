(function () {
    'use strict';

    angular
        .module('pricerequest')
        .controller('ViewPriceRequest', ViewPriceRequest);

    /* @ngInject */
    function ViewPriceRequest($mdToast, $mdDialog, triLoaderService, $http, ItemToEdit) {
        var vm = this;
        vm.requestPriceData = ItemToEdit;
        vm.ClosemdDialog = function () {
            $mdDialog.hide();
        }
        vm.requestPriceData.RequestPrice_Supplier.forEach(function (item, index) {
            vm.requestPriceData.Supplier[index].Price_Status = item.Price_Status;
        });
        vm.viewPriceRequestDetails = function (ItemToShow) {
            console.log(ItemToShow);
            var SupplierID = ItemToShow.Supplier_Code;
            console.log(vm.requestPriceData);
            
            var supplierData = vm.requestPriceData.RequestPrice_Supplier.find(function(o){if(o.Supplier_ID === SupplierID)return o});
            //var productData = vm.requestPriceData.Product;
            supplierData.Details.forEach(function(item,index){
                item.Product_Name = vm.requestPriceData.Product[index].Product_Name;
                var weight = vm.requestPriceData.Weight.find(function(o){if(o.Weight_Code === item.Weight_ID)return o.Weight_Name});
                item.Weight_Name = weight.Weight_Name;
            })
            console.log(supplierData)
            $mdDialog.show({
                multiple: true,
                skipHide: true,
                controller: 'ViewPriceRequestDetailsController',
                controllerAs: 'vmr',
                templateUrl: 'app/price-request/view-price-request/view-price-request-detalis.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                locals: {
                    requestPriceData: supplierData,
                },
            });
        }
    }
})();