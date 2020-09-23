//const { parse } = require("yargs");

(function() {
  "use strict";

  angular
    .module("accounting")
    .controller("ShowPurchasingDetailsController", ShowPurchasingDetailsController);

  /* @ngInject */
  function ShowPurchasingDetailsController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    $filter,
    UserService,
    itemToEdit
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    console.log("itemToEditxx",itemToEdit);
  
    $http({
      method: "Post",
      url: "http://35.246.143.96:3111/getOnePurchasingProductById",
      data: {_id:itemToEdit._id}
    })
      .then(function(data) {
        vm.ProductPurchasing = data.data[0];
        console.log("vm.ProductPurchasing",vm.ProductPurchasing)
        vm.ProductPurchasing.Product_Purchasing_Date = new Date(vm.ProductPurchasing.Product_Purchasing_Date);
        console.log("vm.ProductPurchasing.Product_Purchasing_Date ",vm.ProductPurchasing.Product_Purchasing_Date )
        vm.ProductPurchasing.Product_Date_Of_Production= new Date(vm.ProductPurchasing.Product_Date_Of_Production);
        vm.ProductPurchasing.Product_Date_Of_Expiration= new Date(vm.ProductPurchasing.Product_Date_Of_Expiration);
  
        vm.cashPayments=vm.ProductPurchasing.Cash_Payments;
        vm.chequePayments= vm.ProductPurchasing.Cheque_Payments;
        vm.Still_Have_To_Pay = vm.ProductPurchasing.Total_Price_After_Taxes;
        angular.forEach( vm.cashPayments, function(item, index) {
          vm.Still_Have_To_Pay -= item.Amount_Of_Paying
        });
        angular.forEach( vm.chequePayments, function(item, index) {
          vm.Still_Have_To_Pay -= item.Amount_Of_Paying
        });
        vm.selectedSuppliers = [];
        vm.selectedSuppliers.push({
          Supplier_Code: vm.ProductPurchasing.Supplier_Code,
          Supplier_Name: vm.ProductPurchasing.Supplier_Name
        })
      });
    $http.get("http://35.246.143.96:3111/getAllSupplier").then(function (response) {			   
      vm.selectedSupplierItem = null;
      vm.searchSupplierText = null;
      vm.querySuppliers = querySuppliers;
      vm.Suppliers = response.data;
      vm.Supplierslist = response.data;
     
      vm.transformChip = transformChip;   
      function querySuppliers($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Suppliers.filter(function(supplier) {
              var lowercaseName = angular.lowercase(supplier.Supplier_Name);
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return supplier;
              }
          });
      }
      console.log("vm.selectedSuppliers",vm.selectedSuppliers);
  });
  $http.get("http://35.246.143.96:3111/getProductsForPurchasingForm").then(function (response) {			   
      vm.selectedProductItem = null;
      vm.searchProductText = null;
      vm.queryProducts = queryProducts;
      vm.Products = response.data;
      vm.Productslist = response.data;
      vm.selectedProducts = [];
      vm.transformChip = transformChip;   
      function queryProducts($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Products.filter(function(product) {
              var lowercaseName = angular.lowercase(product.Product_Name);
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return product;
              }
          });
      }
      ///console.log(vm.selectedSuppliers);
  }).then(function(){
    $http.get("http://35.246.143.96:3111/getCountries").then(function (response) {			   
        vm.countries = response.data;
    }).then(function () {			   
      $http.get("http://35.246.143.96:3111/getManufacturer").then(function (response) {			   
          vm.Manufacturers = response.data;
          //
          console.log("xx",vm.ProductPurchasing)
          vm.selectedProducts.push({
            Manufacturer:{
              Supplier_Name : vm.ProductPurchasing.Manufacturer.length>0 ?vm.ProductPurchasing.Manufacturer[0].Supplier_Name : null ,
              Supplier_Code : vm.ProductPurchasing.Manufacturer.length>0 ? vm.ProductPurchasing.Manufacturer[0].Supplier_Code : null
            },
            Product_Code: vm.ProductPurchasing.Product_Code,
            Product_Name: vm.ProductPurchasing.Product_Name
          })
        
  })
  })
})

vm.searchForManufacturer = function(query) {
  var lowercaseQuery = angular.lowercase(query);
  var results = vm.Manufacturers.filter( function(manufacturer) {
          var lowercaseName = angular.lowercase(manufacturer.Supplier_Name);
           if(manufacturer.Supplier_Name != undefined){
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return manufacturer;
              }
          }
      }
  );
  return results;
}; 
vm.manufacturerChanged = function(item){
  if(item)
      vm.selectedManufacturerText = item.Supplier_Name;
  else
      vm.selectedManufacturerText = '';
}

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }


    $http.get("http://35.246.143.96:3111/getWeight").then(function(data) {
      vm.WeightUnitsList = data.data;
    });

    
 
    vm.ClosePurchasing = function() {
      $mdDialog.hide();
    };

  }
})();



