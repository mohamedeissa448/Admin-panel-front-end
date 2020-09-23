//const flatten = require("gulp-flatten");

(function () {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ViewSupplierControllerForSellingAreas', ViewSupplierControllerForSellingAreas);

    /* @ngInject */
    function ViewSupplierControllerForSellingAreas($mdToast, $mdDialog,$scope, triLoaderService,UserService, $http, itemToViewItsSuppliers) {
      var vm = this;
      vm.logedUser = UserService.getCurrentUser();
      vm.SendOrder = {};
      console.log("ItemToEdit",itemToViewItsSuppliers)
      vm.SellingArea_Name=itemToViewItsSuppliers.SellingArea_Name;
      vm.SellingArea_Code=itemToViewItsSuppliers.SellingArea_Code;
      function transformChip(chip) {
        if (angular.isObject(chip)) {
          return chip;
        } else {
          return null;
        }
      }
  
      vm.suppliers = [];
        $http({
          method: "post",
          url: "http://35.246.143.96:3111/supplier/getSellingAreasSuppliers",//35.246.143.96:3111
          data: {SellingArea_Name : vm.SellingArea_Name}
        }).then(function(data) {
          if(data.data){
            vm.suppliers = data.data;
        }
        else{
            vm.suppliers = [];
        }
        console.log (vm.suppliers);
        });
    
        $http({
            method: "post",
            url:"http://35.246.143.96:3111/getAllSupplierByUserCode",
            data:{
                User_Code: vm.logedUser.id,
                letter: "A"
            }
        }).then(function (response) {			   
          vm.selectedSupplierItem = null;
          vm.searchSupplierText = null;
          vm.querySuppliers = querySuppliers;
          vm.AllSuppliers = response.data;
          vm.selectedSuppliers = [];
          vm.transformChip = transformChip;   
          function querySuppliers($query) {
              var lowercaseQuery = angular.lowercase($query);
              return vm.AllSuppliers.filter(function(supplier) {
                  var lowercaseName = angular.lowercase(supplier.Supplier_Name);
                  if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                      return supplier;
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



      vm.AddSupplier = function(){
          vm.selectedSuppliers.forEach(function(element) {
              var SupplierToAdd ={
                  Supplier_Code: element.Supplier_Code,
                  Supplier_Name: element.Supplier_Name
              }
              vm.suppliers.push(SupplierToAdd);
          });
          vm.selectedSuppliers =[];
      }
      vm.CloseSupplier = function(){
          $mdDialog.hide();
      }
      vm.DeleteSupplier = function(supplier){
        console.log("supplierTOdelete",supplier)
          vm.suppliers.splice(vm.suppliers.indexOf(supplier), 1);
          if(!vm.suppliers){
              vm.suppliers =[];
          }//
          var data = {};
          var data = {
              SellingArea_Code: vm.SellingArea_Code,
              SellingArea_Name: vm.SellingArea_Name,
              Supplier_Code: supplier.Supplier_Code
          }
          console.log("data to send",data)
          $http({
            method:"POST",
            url:'http://35.246.143.96:3111/deleteSupplierSellingAreaCodeAndName',
            data :data
        }).then(function(data){ 
            vm.isLoading = false;
            if (data.data.message==true) {
              showAddToast('Supplier deleted successfully',$mdToast);
              triLoaderService.setLoaderActive(false);
          }else{
              showAddErrorToast("Something Went wrong,Please try again later!",$mdToast);
              triLoaderService.setLoaderActive(false);
              vm.CloseSupplier()
          }
        });
      }
      vm.SaveSupplier = function(){
          vm.isLoading = true;
          vm.Supplier_Codes =[];
          vm.suppliers.forEach(function(element) {
              vm.Supplier_Codes.push(element.Supplier_Code);
          })
          vm.Supplier_Codes = uniquearray(vm.Supplier_Codes);
          
          var data = {};
          var data = {
              SellingArea_Code: vm.SellingArea_Code,
              SellingArea_Name: vm.SellingArea_Name,
              Supplier_Codes: vm.Supplier_Codes
          }
          console.log("data to send",data)
          
          $http({
              method:"POST",
              url:'http://35.246.143.96:3111/editSupplierSellingAreaCodeAndName',
              data :data
          }).then(function(data){ 
              vm.isLoading = false;
              if (data.data.message==true) {
                showAddToast("Supplier's selling areas Updated successfully",$mdToast);
                triLoaderService.setLoaderActive(false);
            }else{
                showAddErrorToast("Something Went wrong,Please try again later!",$mdToast);
                triLoaderService.setLoaderActive(false);
                vm.CloseSupplier()
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