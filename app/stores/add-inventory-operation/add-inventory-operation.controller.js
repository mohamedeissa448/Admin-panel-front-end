(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('AddInventoryOperationController', AddInventoryOperationController);

    /* @ngInject */
    function AddInventoryOperationController($mdToast,$mdDialog,UserService, triLoaderService,$http) {
        var vm = this; 

        $http({
            method: "post",
            url: "http://localhost:4000/getAllProductButMinified",
            data: {  } 
          }).then(function(response) {
            vm.selectedProductItem = null;
            vm.searchProductText = null;
            vm.queryProducts = queryProducts;
            vm.AllProducts = response.data;
            vm.selectedProducts = [];
            vm.transformChip = transformChip;
            function queryProducts($query) {
              var lowercaseQuery = angular.lowercase($query);
              return vm.AllProducts.filter(function(product) {
                var lowercaseName = angular.lowercase(product.Product_Name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return product;
                }
              });
            }
          });
        $http.get("http://localhost:4000/companies/getAll").then(function (response) {			   
            vm.companies = response.data;
        });
        $http.get("http://localhost:4000/branches/getAll").then(function (response) {			   
            vm.branches = response.data;
        });
        $http.get("http://localhost:4000/inventories/getAll").then(function (response) {			   
            vm.inventories = response.data;
        });
        vm.AddProduct = function() {
            vm.selectedProducts.forEach(function(element) {
              var ProductToAdd = {
                Product_Code: element.Product_Code,
                Product_Name: element.Product_Name
              };
              vm.Products.push(ProductToAdd);
            });
            vm.selectedProducts = [];
          };
          vm.CloseProduct = function() {
            $mdDialog.hide();
          };
          vm.DeleteProduct = function(product) {
            vm.Products.splice(vm.Products.indexOf(product), 1);
            if (!vm.Products) {
              vm.Products = [];
            }
          
          };
        vm.SubmitData=function(form){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/inventoryOperations/addInventoryOperation',
                data :JSON.stringify(vm.InventoryOperation)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Inventory Operation added successfully',$mdToast);
                    vm.InventoryOperation= {};
                    vm.addInventoryOperationForm.$setPristine();
                    vm.addInventoryOperationForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });
        }
       
    }
})();