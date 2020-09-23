(function() {
  "use strict";

  angular
    .module("stores")
    .controller("OutputStoreController", OutputStoreController);

  /* @ngInject */
  function OutputStoreController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService,
    Product_ID_In_Store
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.Product_OutGoing = {};
    $http({         //we get all sales that this store product has been involved in sales
      method:"post",
      url:"http://35.246.143.96:3111/getAllSalesProductByProduct_ID_In_Store",
      data: {Product_ID_In_Store: Product_ID_In_Store}
    }).then(function (response) {	
      console.log("resp.data",response.data);
      vm.allSalesForThisProductInStore = response.data ;
      //vm.allSalesForThisProductInStore is an array,every object will have the same Product_Code and Product_Name
      vm.Product_Code = vm.allSalesForThisProductInStore[0].Product_Code ;
      vm.Product_Name = vm.allSalesForThisProductInStore[0].Product_Name ;
      //vm.allSalesForThisProductInStore is an array,every object will have the same Supplier_Code and Supplier_Name in product_In_Store property
      vm.Supplier_Code = vm.allSalesForThisProductInStore[0].product_In_Store.Supplier_Code;
      vm.Supplier_Name = vm.allSalesForThisProductInStore[0].product_In_Store.Supplier_Name;
      //we need to collect all the customers that this store product has been sold to,so user can select customer from them along with selling date
      vm.selectedCustomerItem = null;
      vm.searchCustomerText = null;
      vm.queryCustomers = queryCustomers;
      vm.AllCustomers = [];
      vm.selectedCustomers = [];
      vm.transformChip = transformChip;   
      angular.forEach(vm.allSalesForThisProductInStore, function(element, key) {
        vm.AllCustomers.push({
          Customer_Code : element.Product_Sold_To_Customer_Code ,
           Customer_Name : element.Product_Sold_To_Customer_Name,
           Product_Selling_Date : element.Product_Selling_Date,
           Product_OutGoing_Bill_Number : element.Product_OutGoing_Bill_Number,
           Product_OutGoing_Customer_Permission_Number : element.Product_OutGoing_Customer_Permission_Number,
           Product_OutGoing_Bill_Is_taxed : element.Product_OutGoing_Bill_Is_taxed,
           Product_Package_Weight : element.Product_Package_Weight,
           Product_Number_Of_Packages : element.Product_Number_Of_Packages,
           Product_Weight_Unit_Code : element.Product_Weight_Unit_Code,
           Product_Quantity : element.Product_Quantity,
           Sale_ID : element._id
          }) ;
      });
      
      function queryCustomers($query) {
        var lowercaseQuery = angular.lowercase($query);
        return vm.AllCustomers.filter(function(customer) {
              var lowercaseName = angular.lowercase(customer.Customer_Name);
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                      return customer;
              }
          });
      }
      function transformChip(chip) {
        if (angular.isObject(chip)) {
          return chip;
        }
        else{
            return null;
        }
    }

    })
    $http.get("http://35.246.143.96:3111/getWeight").then(function(data) {
      vm.WeightUnitsList = data.data;
    });
    vm.CloseSale = function() {
      $mdDialog.hide();
    };
    
    vm.SubmitSelling = function() {
      if(!vm.selectedCustomers ){
        console.log("{")
        showAddErrorToast("Please select a customer",$mdToast);
      }else{
        triLoaderService.setLoaderActive(true);

        vm.Product_OutGoing.Product_ID_In_Store = Product_ID_In_Store
        vm.Product_OutGoing.Sale_ID = vm.selectedCustomers[0].Sale_ID ;  //id of the sale document that this product sold
        vm.Product_OutGoing.Product_OutGoing_Quantity = vm.selectedCustomers[0].Product_Quantity ;
        vm.Product_OutGoing.Product_OutGoing_Bill_Is_taxed = vm.selectedCustomers[0].Product_OutGoing_Bill_Is_taxed;
        vm.Product_OutGoing.Product_OutGoing_Bill_Number = vm.selectedCustomers[0].Product_OutGoing_Bill_Number;
        vm.Product_OutGoing.Product_OutGoing_Customer_Permission_Number = vm.selectedCustomers[0].Product_OutGoing_Customer_Permission_Number;
        vm.Product_OutGoing.Product_OutGoing_HighChem_Permission_Number = vm.Product_OutGoing.Product_OutGoing_HighChem_Permission_Number;
        vm.Product_OutGoing.Product_OutGoing_Date = new Date(vm.Product_OutGoing.Product_OutGoing_Date) ;
  
        console.log("vm.Product_OutGoing ",vm.Product_OutGoing)
  
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/addProductOutGoingToProductInStore",
          data: { Product_OutGoing: vm.Product_OutGoing }
        }).then(function(data) {
          console.log("data",data)
          if(data.data.message==true){
          showAddToast("Product dispatched Successfully", $mdToast);
          }else{
            showAddErrorToast("Something went wrong,Please try again later",$mdToast);
          }
          triLoaderService.setLoaderActive(false);
          $mdDialog.hide();
        });
      }
   
    };
  }
})();
