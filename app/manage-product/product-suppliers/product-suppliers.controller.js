(function() {
    'use strict';

    angular
        .module('manageproduct')
        .controller('ProductSupplierssController', ProductSupplierssController);

    /* @ngInject */
    function ProductSupplierssController($mdToast, triLoaderService,$http,$mdDialog, Product_Code, Product_Name) {
        var vm = this;
        vm.Product_Name = Product_Name;
        $http({
            method:"post",
            url:"http://35.246.143.96:3111/getSupplierDataByProductID",
            data :{Product_Code : Product_Code}
        }).then(function(data){
            if(data.data.Supplier){
                vm.Supplier = data.data.Supplier;
            }
            else{
                vm.Supplier = [];
            }
        },function(error){
            console.log(error);
        });
        $http.get("http://35.246.143.96:3111/getSupplier").then(function (response) {			   
            vm.selectedSupplierItem = null;
            vm.searchSupplierText = null;
            vm.querySuppliers = querySuppliers;
            vm.AllSuppliers = response.data;
            vm.selectedSuppliers = [];
            vm.transformChip = transformChip;   
            function querySuppliers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.AllSuppliers.filter(function(suplier) {
                    var lowercaseName = angular.lowercase(suplier.Supplier_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return suplier;
                    }
                });
            }
            
        });

        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }



        vm.AddSupplier = function(){
            vm.selectedSuppliers.forEach(function(element) {
                var SupplierToAdd ={
                    Supplier_Code: element.Supplier_Code,
                    Supplier_Name: element.Supplier_Name
                }
                vm.Supplier.push(SupplierToAdd);
            });
            vm.selectedSuppliers =[];
            //clear chips is requiered
        }
        vm.CloseSupplier = function(){
            $mdDialog.hide();
        }
        vm.DeleteSupplier = function(supplier){
            vm.Supplier.splice(vm.Supplier.indexOf(supplier), 1)
        }
        vm.SaveSupplier = function(){
            vm.isLoading = true;
            vm.Product_Supplier_Codes =[];
            vm.Supplier.forEach(function(element) {
                vm.Product_Supplier_Codes.push(element.Supplier_Code);
            })
            vm.Product_Supplier_Codes = uniquearray(vm.Product_Supplier_Codes);
            
            var data = {};
            var data = {
                Product_Code: Product_Code,
                Product_Supplier_Codes: vm.Product_Supplier_Codes
            }
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/editProductSuppliers',
                data :data
            }).then(function(data){ 
                vm.isLoading = false;
            });
        }
        function uniquearray(origArr) {
            var newArr = [],
                origLen = origArr.length,
                found, x, y;
        
            for (x = 0; x < origLen; x++) {
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                    if (origArr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newArr.push(origArr[x]);
                }
            }
            return newArr;
        }
    }
})();