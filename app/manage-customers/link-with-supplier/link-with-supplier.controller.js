(function() {
    'use strict';

    angular
        .module('managecustomers')
        .controller('LinkWithSupplierController', LinkWithSupplierController);

    /* @ngInject */
    function LinkWithSupplierController($mdToast, triLoaderService,$http,$mdDialog,Customer_Code,Customer_Name) {
        var vm = this;
        vm.Customer_Name = Customer_Name;
        $http({
            method:"POST",
            url:'http://35.246.143.96:3111/getUnlinkedSuppliers',
            data :{}
        }).then(function(data){ 
            vm.SupplierList = data.data;
            console.log(vm.SupplierList) 
        });

        vm.searchForSupplier = function(query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vm.SupplierList.filter( function(supplier) {
                    var lowercaseName = angular.lowercase(supplier.Supplier_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return supplier;
                    }
                }
            );
            return results;
        };

        vm.SubmitRequest = function(){
            vm.isLoading = true;
            if(!vm.selectedSupplier){
                vm.noItemSelected = true;
                vm.isLoading = false;
            }
            else{
                console.log(vm.selectedSupplier);
                $http({
                    method:"POST",
                    url:'http://35.246.143.96:3111/linkCustomerWithSupplier',
                    data :{Customer_Code: Customer_Code, Supplier_Code: vm.selectedSupplier.Supplier_Code}
                }).then(function(data){ 
                    console.log(data.data) ;
                    if(data.data.message){
                        showAddToast('Supplier Linked successfully',$mdToast);
                        $mdDialog.hide();
                    }
                    else{
                        showAddErrorToast("Error, link unsuccessed",$mdToast);
                    }
                    
                });
                
            }
        }
        
        vm.CloseForm = function(){
            $mdDialog.hide();
        }
    }
})();