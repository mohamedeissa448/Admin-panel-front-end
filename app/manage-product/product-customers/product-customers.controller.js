(function() {
    'use strict';

    angular
        .module('manageproduct')
        .controller('ProductCustomersController', ProductCustomersController);

    /* @ngInject */
    function ProductCustomersController($mdToast, triLoaderService,$http,$mdDialog, Product_Code, Product_Name) {
        var vm = this;
        vm.Product_Name = Product_Name;
        $http({
            method:"post",
            url:"http://35.246.143.96:3111/getCustomerDataByProductID",
            data :{Product_Code : Product_Code}
        }).then(function(data){
            if(data.data.customer){
                vm.Customers = data.data.customer;
            }
            else{
                vm.Customers = [];
            }
            console.log (vm.Customers);
        },function(error){
            console.log(error);
        });

        $http.get("http://35.246.143.96:3111/getCustomer").then(function (response) {			   
            vm.selectedCustomerItem = null;
            vm.searchCustomerText = null;
            vm.queryCustomers = queryCustomers;
            vm.AllCustomers = response.data;
            vm.selectedCustomers = [];
            vm.transformChip = transformChip;   
            function queryCustomers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.AllCustomers.filter(function(customer) {
                    var lowercaseName = angular.lowercase(customer.Customer_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return customer;
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



        vm.AddCustomer = function(){
            vm.selectedCustomers.forEach(function(element) {
                var CustomerToAdd ={
                    Customer_Code: element.Customer_Code,
                    Customer_Name: element.Customer_Name
                }
                vm.Customers.push(CustomerToAdd);
            });
            vm.selectedCustomers =[];
        }
        vm.CloseCustomer = function(){
            $mdDialog.hide();
        }
        vm.DeleteCustomer = function(customer){
            vm.Customers.splice(vm.Customers.indexOf(customer), 1);
            if(!vm.Customers){
                vm.Customers =[];
            }
        }
        vm.SaveCustomer = function(){
            vm.isLoading = true;
            vm.Product_Customer_Codes =[];
            vm.Customers.forEach(function(element) {
                vm.Product_Customer_Codes.push(element.Customer_Code);
            })
            vm.Product_Customer_Codes = uniquearray(vm.Product_Customer_Codes);
            
            var data = {};
            var data = {
                Product_Code: Product_Code,
                Product_Customer_Codes: vm.Product_Customer_Codes
            }
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/editProductCustomers',
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