(function() {
  "use strict";

  angular
    .module("purchasing")
    .controller("AddPurchasingProductController", AddPurchasingProductController);

  /* @ngInject */
  function AddPurchasingProductController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.ProductPurchasing = {};
    $http.get("http://35.246.143.96:3111/getAllSupplier").then(function (response) {			   
      vm.selectedSupplierItem = null;
      vm.searchSupplierText = null;
      vm.querySuppliers = querySuppliers;
      vm.Suppliers = response.data;
      vm.Supplierslist = response.data;
      vm.selectedSuppliers = [];
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
      ///console.log(vm.selectedSuppliers);
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
      console.log("vm.ProductPurchasing.Total_Price_After_Taxes ",vm.ProductPurchasing.Total_Price_After_Taxes)
      vm.Still_Have_To_Pay = vm.ProductPurchasing.Total_Price_After_Taxes;
    }
    
    vm.cashPayments=[];
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
      vm.Still_Have_To_Pay = vm.Still_Have_To_Pay + parseFloat(cashPayment.Amount_Of_Paying)
        vm.cashPayments.splice(vm.cashPayments.indexOf(cashPayment), 1);
        if(!vm.cashPayments){
            vm.cashPayments =[];
        }
    }
    vm.chequePayments=[]
    vm.AddCheque_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cheque_Date) -new Date(vm.ProductPurchasing.Product_Purchasing_Date));
      var chequePayment={
        Cheque_Date:vm.Cheque_Date,
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
      console.log("chequePaymentTOdelete",chequePayment)
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
      console.log("vm.selectedProducts",vm.selectedProducts)

      if(vm.selectedProducts[0].Manufacturer){
        vm.ProductPurchasing.Product_Manufacturer_Code = vm.selectedProducts[0].Manufacturer.Supplier_Code;
        vm.ProductPurchasing.Product_Manufacturer_Name= vm.selectedProducts[0].Manufacturer.Supplier_Name ;
      }
      console.log("vm.selectedSuppliers",vm.selectedSuppliers)
      vm.ProductPurchasing.Product_Code= vm.selectedProducts[0].Product_Code ;
      vm.ProductPurchasing.Product_Name= vm.selectedProducts[0].Product_Name;
      vm.ProductPurchasing.Supplier_Code= vm.selectedSuppliers[0].Supplier_Code ;
      vm.ProductPurchasing.Supplier_Name= vm.selectedSuppliers[0].Supplier_Name ;
      console.log("vm.ProductPurchasing before",vm.ProductPurchasing)

      vm.ProductPurchasing.Product_Quantity=vm.ProductPurchasing.Product_Number_Of_Packages * vm.ProductPurchasing.Product_Package_Weight;
      vm.ProductPurchasing.PurchasingProduct_CreatedByUser = vm.logedUser.mongoID;
      vm.ProductPurchasing.Cash_Payments= vm.cashPayments;
      vm.ProductPurchasing.Cheque_Payments= vm.chequePayments;
      vm.ProductPurchasing.Product_Purchasing_Date=new Date(vm.ProductPurchasing.Product_Purchasing_Date);
      vm.ProductPurchasing.Product_Date_Of_Production=new Date(vm.ProductPurchasing.Product_Date_Of_Production);
      vm.ProductPurchasing.Product_Date_Of_Expiration=new Date(vm.ProductPurchasing.Product_Date_Of_Expiration);
      if(vm.ProductPurchasing.Price_Of_Unit_Before_Taxes)
      vm.ProductPurchasing.Taxes_Value = vm.ProductPurchasing.Product_Number_Of_Packages * vm.ProductPurchasing.Product_Package_Weight * vm.ProductPurchasing.Price_Of_Unit_Before_Taxes * vm.selectTaxesType * 0.01
      console.log("vm.ProductPurchasing after",vm.ProductPurchasing)

      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/addPurchasingProduct",
        data: { ProductPurchasing: vm.ProductPurchasing }
      }).then(function(data) {
        console.log("data",data)
        if(data.data.message==true){
          vm.ProductPurchasing = {};
          vm.cashPayments=[];
          vm.chequePayments=[];
          vm.selectedProducts=[];
          vm.selectedSuppliers=[]
        showAddToast("Product Added To Purchasing Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later",$mdToast);
        }
        triLoaderService.setLoaderActive(false);

      });
    };
  }
})();
