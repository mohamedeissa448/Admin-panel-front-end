(function() {
  "use strict";

  angular
    .module("purchasing")
    .controller("SupplierRecieverInfoInfo", SupplierRecieverInfoInfo);

  /* @ngInject */
  function SupplierRecieverInfoInfo(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService,
    itemToViewItsCustomers
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.SendOrder = {};
    console.log("ItemToEdit",itemToViewItsCustomers)
    vm.Category_Name=itemToViewItsCustomers.Category_Name;
    vm.Category_ID=itemToViewItsCustomers.Category_ID;
    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }

    vm.customers = [];
      vm.filesToUpload=[];
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/customer/getCategoriedCustomers",//35.246.143.96:3111
        data: {Category_ID : vm.Category_ID}
      }).then(function(data) {
        if(data.data){
          vm.Customers = data.data;
      }
      else{
          vm.Customers = [];
      }
      console.log (vm.Customers);
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
      console.log("customerTOdelete",customer)
        vm.Customers.splice(vm.Customers.indexOf(customer), 1);
        if(!vm.Customers){
            vm.Customers =[];
        }//
        var data = {};
        var data = {
            Category_ID: vm.Category_ID,
            Customer_Code: customer.Customer_Code
        }
        console.log("data to send",data)
        $http({
          method:"POST",
          url:'http://35.246.143.96:3111/deleteCustomerCategoryID',
          data :data
      }).then(function(data){ 
          vm.isLoading = false;
          if (data.data.message==true) {
            showAddToast('Customer deleted successfully',$mdToast);
            triLoaderService.setLoaderActive(false);
        }else{
            showAddErrorToast("Something Went wrong,Please try again later!",$mdToast);
            triLoaderService.setLoaderActive(false);
            vm.CloseCustomer()
        }
      });
    }
    vm.SaveCustomer = function(){
        vm.isLoading = true;
        vm.Customer_Codes =[];
        vm.Customers.forEach(function(element) {
            vm.Customer_Codes.push(element.Customer_Code);
        })
        vm.Customer_Codes = uniquearray(vm.Customer_Codes);
        
        var data = {};
        var data = {
            Category_ID: vm.Category_ID,
            Customer_Codes: vm.Customer_Codes
        }
        console.log("data to send",data)
        
        $http({
            method:"POST",
            url:'http://35.246.143.96:3111/editCustomerCategoryIDs',
            data :data
        }).then(function(data){ 
            vm.isLoading = false;
            if (data.data.message==true) {
              showAddToast("Customer's category Updated successfully",$mdToast);
              triLoaderService.setLoaderActive(false);
          }else{
              showAddErrorToast("Something Went wrong,Please try again later!",$mdToast);
              triLoaderService.setLoaderActive(false);
              vm.CloseCustomer()
          }
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
