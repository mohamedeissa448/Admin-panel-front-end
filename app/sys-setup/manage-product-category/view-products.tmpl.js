//const flatten = require("gulp-flatten");

(function () {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ViewProductsControllerForProductCategory', ViewProductsControllerForProductCategory);

    /* @ngInject */
    function ViewProductsControllerForProductCategory($mdToast, $mdDialog,$scope, triLoaderService,UserService, $http, itemToViewItsProducts) {
        var vm = this;
      vm.logedUser = UserService.getCurrentUser();
      vm.SendOrder = {};
      console.log("ItemToEdit",itemToViewItsProducts)
      vm.Category_Name=itemToViewItsProducts.Category_Name;
      vm.Category_ID=itemToViewItsProducts.Category_ID;
      function transformChip(chip) {
        if (angular.isObject(chip)) {
          return chip;
        } else {
          return null;
        }
      }
  
      vm.products = [];
        $http({
          method: "post",
          url: "http://35.246.143.96:3111/product/getProductCategoriedProducts",//35.246.143.96:3111
          data: {Category_ID : vm.Category_ID}
        }).then(function(data) {
          if(data.data){
            vm.products = data.data;
        }
        else{
            vm.products = [];
        }
        console.log (vm.products);
        });
    
        $http({
            method: "post",
            url:"http://35.246.143.96:3111/getCustomeProductsFieldByUserCode",
            data:{
                User_Code: vm.logedUser.id,
                letter: "A"
            }
        }).then(function (response) {			   
          vm.selectedProductItem = null;
          vm.searchProductText = null;
          vm.queryProducts = queryProducts;
          vm.AllProducts = response.data;
          vm.selectedProducts = [];
          vm.transformChip = transformChip;   
          function queryProducts($query) {
              var lowercaseQuery = angular.lowercase($query);
              return vm.AllProducts.filter(function(Product) {
                  var lowercaseName = angular.lowercase(Product.Product_Name);
                  if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                      return Product;
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



      vm.AddProduct = function(){
          vm.selectedProducts.forEach(function(element) {
              var ProductToAdd ={
                  Product_Code: element.Product_Code,
                  Product_Name: element.Product_Name
              }
              vm.products.push(ProductToAdd);
          });
          vm.selectedProducts =[];
      }
      vm.CloseProduct = function(){
          $mdDialog.hide();
      }
      vm.DeleteProduct = function(product){
        console.log("productTOdelete",product)
          vm.products.splice(vm.products.indexOf(product), 1);
          if(!vm.products){
              vm.products =[];
          }//
          var data = {};
          var data = {
              Category_ID: vm.Category_ID,
              Product_Code: product.Product_Code
          }
          console.log("data to send",data)
          $http({
            method:"POST",
            url:'http://35.246.143.96:3111/deleteProductProductCategoryID',
            data :data
        }).then(function(data){ 
            vm.isLoading = false;
            if (data.data.message==true) {
              showAddToast('Product deleted successfully',$mdToast);
              triLoaderService.setLoaderActive(false);
          }else{
              showAddErrorToast("Something Went wrong,Please try again later!",$mdToast);
              triLoaderService.setLoaderActive(false);
              vm.CloseProduct()
          }
        });
      }
      vm.SaveProduct = function(){
          vm.isLoading = true;
          vm.Product_Codes =[];
          vm.products.forEach(function(element) {
              vm.Product_Codes.push(element.Product_Code);
          })
          vm.Product_Codes = uniquearray(vm.Product_Codes);
          
          var data = {};
          var data = {
              Category_ID: vm.Category_ID,
              Product_Codes: vm.Product_Codes
          }
          console.log("data to send",data)
          
          $http({
              method:"POST",
              url:'http://35.246.143.96:3111/editProductProductCategoryIDs',
              data :data
          }).then(function(data){ 
              vm.isLoading = false;
              if (data.data.message==true) {
                showAddToast("Product's product category Updated successfully",$mdToast);
                triLoaderService.setLoaderActive(false);
            }else{
                showAddErrorToast("Something Went wrong,Please try again later!",$mdToast);
                triLoaderService.setLoaderActive(false);
                vm.CloseProduct()
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