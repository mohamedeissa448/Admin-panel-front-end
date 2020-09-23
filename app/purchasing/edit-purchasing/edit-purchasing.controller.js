//const { parse } = require("yargs");

(function() {
  "use strict";

  angular
    .module("purchasing")
    .controller("EditPurchasingController", EditPurchasingController);

  /* @ngInject */
  function EditPurchasingController(
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
    console.log("itemToEdit",itemToEdit);
  
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
    vm.calcTotalPriceAfterTaxes =function(){
      console.log("vm.selectTaxesType ",typeof(vm.selectTaxesType) )
      console.log("vm.selectTaxesType ",vm.selectTaxesType )
      
      if(vm.selectTaxesType == 14){
        vm.ProductPurchasing.Amount_Of_Taxes=14
      }else if(vm.selectTaxesType == "exempt"){
        vm.ProductPurchasing.Amount_Of_Taxes= 0
      }
      else if(vm.selectTaxesType == "without"){
        vm.ProductPurchasing.Amount_Of_Taxes= 0
      }
      else if(vm.selectTaxesType == "other"){
        vm.ProductPurchasing.Amount_Of_Taxes= vm.Other_Amount_Of_Taxes
      }
      vm.ProductPurchasing.Total_Price_Before_Taxes=vm.ProductPurchasing.Product_Number_Of_Packages * vm.ProductPurchasing.Product_Package_Weight * vm.ProductPurchasing.Price_Of_Unit_Before_Taxes
      console.log("vm.ProductPurchasing",vm.ProductPurchasing);
      vm.ProductPurchasing.Total_Price_After_Taxes = vm.ProductPurchasing.Total_Price_Before_Taxes+ (vm.ProductPurchasing.Total_Price_Before_Taxes * (vm.ProductPurchasing.Amount_Of_Taxes /100));
      console.log("vm.ProductPurchasing.Total_Price_After_Taxes ",vm.ProductPurchasing.Total_Price_After_Taxes);
      vm.Still_Have_To_Pay = vm.ProductPurchasing.Total_Price_After_Taxes;
      angular.forEach( vm.cashPayments, function(item, index) {
        vm.Still_Have_To_Pay -= item.Amount_Of_Paying
      });
      angular.forEach( vm.chequePayments, function(item, index) {
        vm.Still_Have_To_Pay -= item.Amount_Of_Paying
      });
    }
   
    vm.AddCash_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cash_Paying_Date) -new Date(vm.ProductPurchasing.Product_Purchasing_Date));
      var cashPayment={
        Paying_Date: vm.Cash_Paying_Date,
        Amount_Of_Paying: vm.Cash_Amount_Of_Paying,
        Number_Of_Days_From_Purchasing_To_Paying:Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ,
      }
      vm.Still_Have_To_Pay = vm.Still_Have_To_Pay - parseFloat(cashPayment.Amount_Of_Paying)
      console.log("cashPayment",cashPayment)
      vm.cashPayments.push(cashPayment)
      vm.Cash_Paying_Date ="";
      vm.Cash_Amount_Of_Paying ="";
    }
    vm.DeleteCashPayment = function(cashPayment){
      console.log("cashPaymentTOdelete",cashPayment);
      vm.Still_Have_To_Pay = vm.Still_Have_To_Pay +parseFloat( cashPayment.Amount_Of_Paying)
        vm.cashPayments.splice(vm.cashPayments.indexOf(cashPayment), 1);
        if(!vm.cashPayments){
            vm.cashPayments =[];
        }
    }
    vm.AddCheque_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cheque_Date) -new Date(vm.ProductPurchasing.Product_Purchasing_Date));
      var chequePayment={
        Cheque_Date: vm.Cheque_Date,
        Amount_Of_Paying: vm.Cheque_Amount_Of_Paying,
        Number_Of_Days_From_Purchasing_To_Paying:Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ,
      }
      vm.Still_Have_To_Pay = vm.Still_Have_To_Pay - parseFloat(chequePayment.Amount_Of_Paying) 
      console.log("chequePayment",chequePayment)
      vm.chequePayments.push(chequePayment)
      vm.Cheque_Amount_Of_Paying ="";
      vm.Cheque_Date="";
    }
    vm.DeleteChequePayment = function(chequePayment){
      console.log("chequePaymentTOdelete",chequePayment);
      vm.Still_Have_To_Pay = vm.Still_Have_To_Pay + parseFloat(chequePayment.Amount_Of_Paying) 
        vm.chequePayments.splice(vm.chequePayments.indexOf(chequePayment), 1);
        if(!vm.chequePayments){
            vm.chequePayments =[];
        }
    }
    vm.ClosePurchasing = function() {
      $mdDialog.hide();
    };
    vm.SubmitPurchasing = function() {
      triLoaderService.setLoaderActive(true);
      if(vm.selectedProducts[0].Manufacturer){
        vm.ProductPurchasing.Product_Manufacturer_Code = vm.selectedProducts[0].Manufacturer.Supplier_Code;
        vm.ProductPurchasing.Product_Manufacturer_Name= vm.selectedProducts[0].Manufacturer.Supplier_Name ;
  
      }
      console.log("vm.selectedProduct_Manufacturer",vm.selectedProduct_Manufacturer)
      console.log("vm.selectedProducts",vm.selectedProducts)
      console.log("vm.selectedSuppliers",vm.selectedSuppliers)
      vm.ProductPurchasing.Product_Code= vm.selectedProducts[0].Product_Code ;
      vm.ProductPurchasing.Product_Name= vm.selectedProducts[0].Product_Name;
      vm.ProductPurchasing.Supplier_Code= vm.selectedSuppliers[0].SupplierCode ;
      vm.ProductPurchasing.Supplier_Name= vm.selectedSuppliers[0].Supplier_Name ;
      vm.ProductPurchasing.Product_Quantity=vm.ProductPurchasing.Product_Number_Of_Packages * vm.ProductPurchasing.Product_Package_Weight
      vm.ProductPurchasing.PurchasingProduct_CreatedByUser = vm.logedUser.mongoID;
      vm.ProductPurchasing.Cash_Payments= vm.cashPayments;
      vm.ProductPurchasing.Cheque_Payments= vm.chequePayments;
      if(vm.ProductPurchasing.Price_Of_Unit_Before_Taxes)
      vm.ProductPurchasing.Taxes_Value = vm.ProductPurchasing.Product_Number_Of_Packages * vm.ProductPurchasing.Product_Package_Weight * vm.ProductPurchasing.Price_Of_Unit_Before_Taxes * vm.selectTaxesType * 0.01

      var id= vm.ProductPurchasing._id;
      delete vm.ProductPurchasing._id;
      delete vm.ProductPurchasing.__v;
      console.log("vm.ProductPurchasing",vm.ProductPurchasing)

      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/editPurchasingProductById",
        data: { 
          ProductPurchasing: vm.ProductPurchasing,
          _id: id,
       }
      }).then(function(data) {
        console.log("data",data)
        if(data.data.message==true){
        showAddToast("Product Updated Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later",$mdToast);
        }
        triLoaderService.setLoaderActive(false); 
      });
    };
  }
})();



