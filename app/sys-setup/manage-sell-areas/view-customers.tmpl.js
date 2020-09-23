//const flatten = require("gulp-flatten");

(function () {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ViewCustomerControllerForSellingAreas', ViewCustomerControllerForSellingAreas);

    /* @ngInject */
    function ViewCustomerControllerForSellingAreas($mdToast, $mdDialog,$scope, triLoaderService,UserService, $http, itemToViewItsCustomers) {
      var vm = this;
      vm.logedUser = UserService.getCurrentUser();
      vm.SendOrder = {};
      console.log("ItemToEdit",itemToViewItsCustomers)
      vm.SellingArea_Name=itemToViewItsCustomers.SellingArea_Name;
      vm.SellingArea_Code=itemToViewItsCustomers.SellingArea_Code;
      function transformChip(chip) {
        if (angular.isObject(chip)) {
          return chip;
        } else {
          return null;
        }
      }
  
      vm.customers = [];
        $http({
          method: "post",
          url: "http://35.246.143.96:3111/customer/getSellingAreasCustomers",//35.246.143.96:3111
          data: {SellingArea_Name : vm.SellingArea_Name}
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
            SellingArea_Code: vm.SellingArea_Code,
            SellingArea_Name: vm.SellingArea_Name,
            Customer_Code: customer.Customer_Code
          }
          console.log("data to send",data)
          $http({
            method:"POST",
            url:'http://35.246.143.96:3111/deleteCustomerSellingAreaCodeAndName',
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
            SellingArea_Code: vm.SellingArea_Code,
            SellingArea_Name: vm.SellingArea_Name,
            Customer_Codes: vm.Customer_Codes
          }
          console.log("data to send",data)
          
          $http({
              method:"POST",
              url:'http://35.246.143.96:3111/editCustomerSellingAreaCodeAndName',
              data :data
          }).then(function(data){ 
              vm.isLoading = false;
              if (data.data.message==true) {
                showAddToast("Customer's selling areas Updated successfully",$mdToast);
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