(function () {
    'use strict';

    angular
        .module('customerorder')
        .controller('FixCustomerOrderProductsController', FixCustomerOrderProductsController);

    /* @ngInject */
    function FixCustomerOrderProductsController($mdToast, $mdDialog, triLoaderService,UserService, $http, ItemToEdit) {
      var vm = this;
      vm.logedUser = UserService.getCurrentUser();
      vm.SendOrder = {};
      console.log("ItemToEdit",ItemToEdit)
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
  
    
      vm.productOrders = [];
      angular.forEach(ItemToEdit.CustomerOrder_Products, function(element, key) {
        console.log("e", element, "key", key);
        vm.productOrders.push({
          Order_Product_Name: element.Order_Product_Name,
          Order_Product: element.Order_Product,
        });
      });
      vm.productOrder = [];
      vm.AddproductOrder = function() {
        console.log("vm.productsearchText", vm.productsearchText);
        if (
          !vm.productsearchText 
        ) {
          showAddErrorToast("You must select a product ", $mdToast);
        } else {
          console.log("vm.selectedProduct", vm.selectedProduct);
          var Order_Product;
          var Product_Name;
          if (vm.selectedProduct) {
            Order_Product = vm.selectedProduct._id;
            Product_Name = vm.selectedProduct.Product_Name;
          } 
  
          var productOrder = {
            Order_Product: Order_Product,
            Order_Product_Name: Product_Name,
         
          };
  
          vm.productOrders.push(productOrder);
          console.log(productOrder);
          vm.selectedProduct = null;
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
  
      vm.CloseUpdateOrder = function() {
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
          });
        });
  
        vm.SendOrder.CustomerOrder_Products = CustomerOrder_Products;
        vm.SendOrder.CustomerOrder_Code=ItemToEdit.CustomerOrder_Code
        console.log("vm.SendOrder", vm.SendOrder);
  
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/updateCustomerOrderProductsIDsAndNames",
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