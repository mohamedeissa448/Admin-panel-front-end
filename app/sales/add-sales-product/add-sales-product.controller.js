(function() {
  "use strict";

  angular
    .module("purchasing")
    .controller("AddSaleProductController", AddSaleProductController);

  /* @ngInject */
  function AddSaleProductController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.ProductSelling = {};
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
  });//we get the products we need to sell from store.
  $http.get("http://35.246.143.96:3111/getAllStoreProducts").then(function (response) {	
      console.log("data",response.data)		   
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
//start getting customers
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
        vm.ProductSelling.Amount_Of_Taxes=14
      }else if(vm.selectTaxesType == "exempt"){
        vm.ProductSelling.Amount_Of_Taxes= 0
      }
      else if(vm.selectTaxesType == "without"){
        vm.ProductSelling.Amount_Of_Taxes= 0
      }
      else if(vm.selectTaxesType == "other"){
        vm.ProductSelling.Amount_Of_Taxes= vm.Other_Amount_Of_Taxes
      }
      vm.ProductSelling.Total_Price_Before_Taxes=vm.ProductSelling.Product_Number_Of_Packages * vm.ProductSelling.Product_Package_Weight * vm.ProductSelling.Price_Of_Unit_Before_Taxes
      console.log("vm.ProductSelling",vm.ProductSelling);
      vm.ProductSelling.Total_Price_After_Taxes = vm.ProductSelling.Total_Price_Before_Taxes+ (vm.ProductSelling.Total_Price_Before_Taxes * (vm.ProductSelling.Amount_Of_Taxes /100));
      console.log("vm.ProductSelling.Total_Price_After_Taxes ",vm.ProductSelling.Total_Price_After_Taxes);
      vm.Still_Have_To_Get_Paid = vm.ProductSelling.Total_Price_After_Taxes;
    }
    
    vm.cashPayments=[];
    vm.AddCash_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cash_Paying_Date) -new Date(vm.ProductSelling.Product_Selling_Date));
      var cashPayment={
        Paying_Date: vm.Cash_Paying_Date,
        Amount_Of_Paying: vm.Cash_Amount_Of_Paying,
        Number_Of_Days_From_Selling_To_Be_Paid:Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ,       
      }
      vm.Still_Have_To_Get_Paid = vm.Still_Have_To_Get_Paid - parseFloat(cashPayment.Amount_Of_Paying)

      console.log("cashPayment",cashPayment)
      vm.cashPayments.push(cashPayment)
      vm.Cash_Paying_Date ="";
      vm.Cash_Amount_Of_Paying ="";
    }
    vm.DeleteCashPayment = function(cashPayment){
      console.log("cashPaymentTOdelete",cashPayment);
      vm.Still_Have_To_Get_Paid = vm.Still_Have_To_Get_Paid + parseFloat(cashPayment.Amount_Of_Paying)
        vm.cashPayments.splice(vm.cashPayments.indexOf(cashPayment), 1);
        if(!vm.cashPayments){
            vm.cashPayments =[];
        }
    }
    vm.chequePayments=[]
    vm.AddCheque_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cheque_Date) -new Date(vm.ProductSelling.Product_Selling_Date));
      var chequePayment={
        Cheque_Date:vm.Cheque_Date,
        Amount_Of_Paying: vm.Cheque_Amount_Of_Paying,
        Number_Of_Days_From_Selling_To_Be_Paid:Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ,
      }
      vm.Still_Have_To_Get_Paid = vm.Still_Have_To_Get_Paid - parseFloat(chequePayment.Amount_Of_Paying)
      console.log("chequePayment",chequePayment)
      vm.chequePayments.push(chequePayment)
      vm.Cheque_Amount_Of_Paying ="";
 
      vm.Cheque_Date="";
    }
    vm.DeleteChequePayment = function(chequePayment){
      console.log("chequePaymentTOdelete",chequePayment);
      vm.Still_Have_To_Get_Paid = vm.Still_Have_To_Get_Paid + parseFloat(chequePayment.Amount_Of_Paying)

        vm.chequePayments.splice(vm.chequePayments.indexOf(chequePayment), 1);
        if(!vm.chequePayments){
            vm.chequePayments =[];
        }
    }
    vm.CloseSale = function() {
      $mdDialog.hide();
    };
    
    vm.SubmitSelling = function() {
      triLoaderService.setLoaderActive(true);
      //console.log("vm.selectedProducts[0].Product_Manufacturer",vm.selectedProducts[0].Product_Manufacturer)
      //vm.ProductSelling.Product_Manufacturer_Code = vm.selectedProducts[0].Product_Manufacturer_Code;
      //vm.ProductSelling.Product_Manufacturer_Name= vm.selectedProducts[0].Product_Manufacturer ;
      console.log("vm.selectedProducts",vm.selectedProducts)
      console.log("vm.selectedSuppliers",vm.selectedSuppliers)
      //only next two are useful for searches
      vm.ProductSelling.Product_Code= vm.selectedProducts[0].Product_Code ;
      vm.ProductSelling.Product_Name= vm.selectedProducts[0].Product_Name;
      //vm.ProductSelling.Supplier_Code= vm.selectedSuppliers[0].Supplier_Code ;
      //vm.ProductSelling.Supplier_Name= vm.selectedSuppliers[0].Supplier_Name ;
      console.log("vm.ProductSelling before",vm.ProductSelling)
      vm.ProductSelling.Product_ID_In_Store= vm.selectedProducts[0]._id;
      vm.ProductSelling.Product_Sold_To_Customer_Code= vm.selectedCustomers[0]["Customer_Code"]
      vm.ProductSelling.Product_Sold_To_Customer_Name= vm.selectedCustomers[0]["Customer_Name"]
      vm.ProductSelling.Product_Quantity=vm.ProductSelling.Product_Number_Of_Packages * vm.ProductSelling.Product_Package_Weight
      vm.ProductSelling.SellingProduct_CreatedByUser = vm.logedUser.mongoID;
      vm.ProductSelling.Cash_Payments= vm.cashPayments;
      vm.ProductSelling.Cheque_Payments= vm.chequePayments;
      vm.ProductSelling.Product_Selling_Date=new Date(vm.ProductSelling.Product_Selling_Date);
      vm.ProductSelling.Taxes_Value = vm.ProductSelling.Product_Number_Of_Packages * vm.ProductSelling.Product_Package_Weight * vm.ProductSelling.Price_Of_Unit_Before_Taxes * vm.selectTaxesType * 0.01

     // vm.ProductSelling.Product_Date_Of_Production=new Date(vm.ProductSelling.Product_Date_Of_Production);
      //vm.ProductSelling.Product_Date_Of_Expiration=new Date(vm.ProductSelling.Product_Date_Of_Expiration);
      console.log("vm.ProductSelling after",vm.ProductSelling)

      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/addSellingProduct",
        data: { ProductSelling: vm.ProductSelling }
      }).then(function(data) {
        console.log("data",data)
        if(data.data.message==true){
          vm.ProductSelling = {};
          vm.cashPayments=[];
          vm.chequePayments=[];
          vm.selectedProducts=[];
          vm.selectedSuppliers=[]
        showAddToast("Product Added To Sales Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later",$mdToast);
        }
        triLoaderService.setLoaderActive(false);

      });
    };
  }
})();
