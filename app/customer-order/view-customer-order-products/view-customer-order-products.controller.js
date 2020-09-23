(function () {
    'use strict';

    angular
        .module('customerorder')
        .controller('viewCustomerOrderProducts', viewCustomerOrderProducts);

    /* @ngInject */
    function viewCustomerOrderProducts($mdToast, $mdDialog, triLoaderService,UserService, $http, ItemToEdit) {
        var vm = this;
        vm.logedUser = UserService.getCurrentUser();
        vm.SendOrder = {};
        console.log("ItemToEdit",ItemToEdit)
        vm.CustomerOrder_Status=ItemToEdit.CustomerOrder_Status
        vm.Customer_Name=ItemToEdit.CustomerOrder_Customer[0].Customer_Name;
        function transformChip(chip) {
          if (angular.isObject(chip)) {
            return chip;
          } else {
            return null;
          }
        }
    
        $http({
          method: "get",
          url: "http://35.246.143.96:3111/getProducts",//
          data: {}
        }).then(function(data) {
          vm.Productslist = data.data;
        });
    
        $http.get("http://35.246.143.96:3111/getWeight").then(function(data) {
          vm.WeightUnitsList = data.data;
        });
    
        vm.productOrders = [];
        angular.forEach(ItemToEdit.CustomerOrder_Products, function(element, key) {
          console.log("e", element, "key", key);
          vm.productOrders.push({
            Order_Product_Name: element.Order_Product_Name,
            Order_Product: element.Order_Product,
            Order_RequestedQuantity: element.Order_RequestedQuantity,
            Order_RequestedQuantityWeightUnit:
              element.Order_RequestedQuantityWeightUnit,
            Order_Note: element.Order_Note,
            Weight_Name:element.Order_RequestedQuantityWeightUnit.Weight_Name
          });
        });
        vm.productOrder = [];
        vm.AddproductOrder = function() {
          console.log("vm.productsearchText", vm.productsearchText);
          if (
            !vm.productsearchText ||
            vm.SendOrder_Amount == undefined ||
            vm.SendOrder_Amount == "" ||
            vm.SendOrder_Units == undefined ||
            vm.SendOrder_Units == "" ||
            vm.Order_Note == undefined ||
            vm.Order_Note == ""
          ) {
            showAddErrorToast("You must Fill all product data", $mdToast);
          } else {
            console.log("vm.selectedProduct", vm.selectedProduct);
            console.log("vm.SendOrder_Units", vm.SendOrder_Units);
            var Order_Product;
            var Product_Name;
            var Product_ID;
            if (vm.selectedProduct) {
              Order_Product = vm.selectedProduct._id;
              Product_Name = vm.selectedProduct.Product_Name;
              Product_ID = vm.selectedProduct.Product_Code;
            } else {
              Order_Product = null;
              Product_Name = vm.productsearchText;
              Product_ID = null;
            }
    
            var productOrder = {
              Order_Product: Order_Product,
              Order_Product_Name: Product_Name,
              Product_ID: Product_ID,
              Order_RequestedQuantity: vm.SendOrder_Amount,
              SendOrder_Amount: vm.SendOrder_Amount,
              Weight_Name: vm.SendOrder_Units.Weight_Name,
              Quantity_Required: vm.SendOrder_Amount,
              Weight_ID: vm.SendOrder_Units.Weight_Code,
              Order_RequestedQuantityWeightUnit: vm.SendOrder_Units._id,
              Order_Note: vm.Order_Note
            };
    
            vm.productOrders.push(productOrder);
            console.log(productOrder);
    
            vm.selectedProduct = null;
            vm.SendOrder_Amount = "";
            vm.SendOrder_Units = "";
            vm.Order_Note = "";
          }
        };
 
    
        vm.DeleteRequest = function(productOrder) {
          console.log("productOrder", productOrder);
          vm.productOrders.splice(vm.productOrders.indexOf(productOrder), 1);
          console.log("after delete productOrders", vm.productOrders);
        };
    
        vm.searchForproduct = function(query) {
          var lowercaseQuery = angular.lowercase(query);
          var results = vm.Productslist.filter(function(product) {
            var lowercaseName = angular.lowercase(product.Product_Name);
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return product;
            }
          });
          return results;
        };
    
        vm.CloseSendOrder = function() {
          $mdDialog.hide();
        };
        vm.SubmitRequest = function() {
          triLoaderService.setLoaderActive(true);
          var CustomerOrder_Products = [];
          angular.forEach(vm.productOrders, function(element, key) {
            console.log("e", element, "key", key);
            CustomerOrder_Products.push({
              Order_Product_Name: element.Order_Product_Name,
              Order_Product: element.Order_Product,
              Order_RequestedQuantity: element.Order_RequestedQuantity,
              Order_RequestedQuantityWeightUnit:
                element.Order_RequestedQuantityWeightUnit,
              Order_Note: element.Order_Note
            });
          });
    
          console.log("vm.productOrders", vm.productOrders);
          vm.SendOrder.CustomerOrder_Products = CustomerOrder_Products;
          vm.SendOrder.CustomerOrder_Code=ItemToEdit.CustomerOrder_Code
          console.log("vm.SendOrder", vm.SendOrder);
    
          $http({
            method: "POST",
            url: "http://35.246.143.96:3111/updateCustomerOrderProducts",
            data: vm.SendOrder 
          }).then(function(response) {
            console.log("response ",response)
            vm.productOrders = [];
            vm.productOrder = [];

            if(response.data.message=true)
            showAddToast("Request Order Updated Successfully", $mdToast);
            else{
              showAddToast("Something Went Wrong,Please try again later..", $mdToast);
            }
            triLoaderService.setLoaderActive(false);
          });
        };

    }
})();

