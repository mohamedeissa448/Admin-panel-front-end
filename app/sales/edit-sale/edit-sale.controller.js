(function() {
  "use strict";

  angular
    .module("sales")
    .controller("EditSaleController", EditSaleController);

  /* @ngInject */
  function EditSaleController(
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
  //need tis route to initialize only sales data
    $http({
      method: "Post",
      url: "http://35.246.143.96:3111/getOneSaleProductById",
      data: {_id:itemToEdit._id}
    })
      .then(function(data) {
        vm.ProductSelling = data.data[0];
        console.log("vm.ProductSelling",vm.ProductSelling)
        vm.ProductSelling.Product_Selling_Date = new Date(vm.ProductSelling.Product_Selling_Date);
  
        vm.cashPayments=vm.ProductSelling.Cash_Payments;
        vm.chequePayments= vm.ProductSelling.Cheque_Payments;
        vm.Still_Have_To_Get_Paid = vm.ProductSelling.Total_Price_After_Taxes;
        angular.forEach( vm.cashPayments, function(item, index) {
          vm.Still_Have_To_Get_Paid -= item.Amount_Of_Paying
        });
        angular.forEach( vm.chequePayments, function(item, index) {
          vm.Still_Have_To_Get_Paid -= item.Amount_Of_Paying
        });
      })//need this route to initialize only purchasing data
      .then(function() {
        $http({
          method: "Post",
          url: "http://35.246.143.96:3111/getOnePurchasingProductById",
          data: {_id:vm.ProductSelling.product_In_Store.Product_Purchasing_ID}
        })
          .then(function(data) {
            vm.PurchasingProduct = data.data[0];
            console.log("vm.PurchasingProduct",vm.PurchasingProduct);
          })
      });
    $http.get("http://35.246.143.96:3111/getAllSupplier").then(function (response) {			   
      vm.selectedSupplierItem = null;
      vm.searchSupplierText = null;
      vm.querySuppliers = querySuppliers;
      vm.Suppliers = response.data;
      vm.Supplierslist = response.data;
      vm.selectedSuppliers = [];
      vm.selectedSuppliers.push({
        Supplier_Code: vm.ProductSelling.Supplier_Code,
        Supplier_Name: vm.ProductSelling.Supplier_Name
      })
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
 /* $http.get("http://35.246.143.96:3111/getProducts").then(function (response) {			   
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
  })*///we get the products we need to sell from store.
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
  })
  .then(function(){
    $http.get("http://35.246.143.96:3111/getCountries").then(function (response) {			   
        vm.countries = response.data;
    }).then(function () {			   
      $http.get("http://35.246.143.96:3111/getManufacturer").then(function (response) {			   
          vm.Manufacturers = response.data;
          //initialize rest of form inputs
          vm.selectedProducts.push({
            Product_Code: vm.ProductSelling.Product_Code,
            Product_Name: vm.ProductSelling.Product_Name,
            purchasing:{
              Supplier_Code: vm.PurchasingProduct.Supplier_Code,
              Supplier_Name: vm.PurchasingProduct.Supplier_Name,
              Product_Manufacturer_Name: vm.PurchasingProduct.Product_Manufacturer_Name,
              Product_Manufacturer_Code:vm.PurchasingProduct.Product_Manufacturer_Code,
              Product_Origin_Country_Code: vm.PurchasingProduct.Product_Origin_Country_Code,
              Product_Date_Of_Production: vm.PurchasingProduct.Product_Date_Of_Production,
              Product_Date_Of_Expiration: vm.PurchasingProduct.Product_Date_Of_Expiration,
              Product_BatchNumber: vm.PurchasingProduct.Product_BatchNumber,

            }

            
          })
        
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
  //initialize customer name and code
  vm.selectedCustomers.push({
    Customer_Code:vm.ProductSelling.customer.Customer_Code,
    Customer_Name:vm.ProductSelling.customer.Customer_Name
  })
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
      angular.forEach( vm.cashPayments, function(item, index) {
        vm.Still_Have_To_Get_Paid -= item.Amount_Of_Paying
      });
      angular.forEach( vm.chequePayments, function(item, index) {
        vm.Still_Have_To_Get_Paid -= item.Amount_Of_Paying
      });
    }
    vm.openSupplierRecieverInfo = function(){
      $mdDialog.show({
        controller: "SupplierRecieverInfoInfo",
        controllerAs: "vm",
        multiple: true,
        templateUrl:
          "app/purchasing/supplier-reciever-info/supplier-reciever-info.tmpl.html",
        clickOutsideToClose: true,
        locals: {
          itemToViewItsCustomers: {}
        },
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          
        }
      });
    }
    vm.AddCash_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cash_Paying_Date) -new Date(vm.ProductSelling.Product_Selling_Date));
      var cashPayment={
        Paying_Date: vm.Cash_Paying_Date,
        Amount_Of_Paying: vm.Cash_Amount_Of_Paying,
        Number_Of_Days_From_Selling_To_Be_Paid:Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ,      
      }
      console.log("cashPayment",cashPayment)
      vm.Still_Have_To_Get_Paid = vm.Still_Have_To_Get_Paid - parseFloat(cashPayment.Amount_Of_Paying)
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
    vm.AddCheque_Payment = function(){
      var diffTime = Math.abs(new Date(vm.Cheque_Date) -new Date(vm.ProductSelling.Product_Selling_Date));
      var chequePayment={
        Cheque_Date: vm.Cheque_Date,
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
      vm.ProductSelling.Product_Sold_To_Customer_Code= vm.selectedCustomers[0]["Customer_Code"];
      vm.ProductSelling.Product_Sold_To_Customer_Name= vm.selectedCustomers[0]["Customer_Name"]
      vm.ProductSelling.Product_Quantity=vm.ProductSelling.Product_Number_Of_Packages * vm.ProductSelling.Product_Package_Weight
      vm.ProductSelling.SellingProduct_CreatedByUser = vm.logedUser.mongoID;
      vm.ProductSelling.Cash_Payments= vm.cashPayments;
      vm.ProductSelling.Cheque_Payments= vm.chequePayments;
      vm.ProductSelling.Product_Selling_Date=new Date(vm.ProductSelling.Product_Selling_Date);
      vm.ProductSelling.Taxes_Value = vm.ProductSelling.Product_Number_Of_Packages * vm.ProductSelling.Product_Package_Weight * vm.ProductSelling.Price_Of_Unit_Before_Taxes * vm.selectTaxesType * 0.01

      var id= vm.ProductSelling._id;
      delete vm.ProductSelling._id;
      delete vm.ProductSelling.__v;
     // vm.ProductSelling.Product_Date_Of_Production=new Date(vm.ProductSelling.Product_Date_Of_Production);
      //vm.ProductSelling.Product_Date_Of_Expiration=new Date(vm.ProductSelling.Product_Date_Of_Expiration);
      console.log("vm.ProductSelling after",vm.ProductSelling)


      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/editSaleProductById",
        data: { 
          ProductSelling: vm.ProductSelling,
          _id: id,
       }
      }).then(function(data) {
        console.log("data",data)
        if(data.data.message==true){
        showAddToast("Sale Updated Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later",$mdToast);
        }
        triLoaderService.setLoaderActive(false); 
      });
    };
  }
})();



