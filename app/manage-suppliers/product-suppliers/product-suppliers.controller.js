(function() {
  "use strict";

  angular
    .module("managesuppliers")
    .controller("ProductSuppliersController", ProductSuppliersController);

  /* @ngInject */
  function ProductSuppliersController(
    $mdToast,
    triLoaderService,
    $http,
    $mdDialog,
    UserService,
    Supplier_Code,
    Supplier_Name
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();

    vm.Supplier_Name = Supplier_Name;
    $http({
      method: "post",
      url: "http://35.246.143.96:3111/getProductDataBySupplierID",
      data: { Supplier_Code: Supplier_Code }
    }).then(
      function(data) {
        console.log("data", data);
        if (data.data) {
          vm.Products = data.data;
        } else {
          vm.Products = [];
        }
        console.log("vm.Products", vm.Products);
      },
      function(error) {
        console.log(error);
      }
    );
    $http({
      method: "post",
      url: "http://35.246.143.96:3111/getCustomeProductsFieldByUserCode",
      data: { User_Code: 1, letter: "" } //vm.logedUser.id
    }).then(function(response) {
      vm.selectedProductItem = null;
      vm.searchProductText = null;
      vm.queryProducts = queryProducts;
      vm.AllProducts = response.data;
      vm.selectedProducts = [];
      vm.transformChip = transformChip;
      function queryProducts($query) {
        var lowercaseQuery = angular.lowercase($query);
        return vm.AllProducts.filter(function(product) {
          var lowercaseName = angular.lowercase(product.Product_Name);
          if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
            return product;
          }
        });
      }
    });

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }

    vm.AddProduct = function() {
      vm.selectedProducts.forEach(function(element) {
        var ProductToAdd = {
          Product_Code: element.Product_Code,
          Product_Name: element.Product_Name
        };
        vm.Products.push(ProductToAdd);
      });
      vm.selectedProducts = [];
    };
    vm.CloseProduct = function() {
      $mdDialog.hide();
    };
    vm.DeleteProduct = function(product) {
      vm.Products.splice(vm.Products.indexOf(product), 1);
      if (!vm.Products) {
        vm.Products = [];
      }
      var data = {};
      var data = {
        Supplier_Code: Supplier_Code,
        Product_Code: product.Product_Code
      };
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/removeProductSupplierCodes",
        data: data
      }).then(function(data) {
        vm.isLoading = false;
      });
    }; ////////////
    vm.SaveProduct = function() {
      vm.isLoading = true;
      vm.Product_Codes = [];
      vm.Products.forEach(function(element) {
        vm.Product_Codes.push(element.Product_Code);
      });
      vm.Product_Codes = uniquearray(vm.Product_Codes);

      var data = {};
      var data = {
        Supplier_Code: Supplier_Code,
        Product_Codes: vm.Product_Codes
      };
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/editProductSupplierCodes",
        data: data
      }).then(function(data) {
        vm.isLoading = false;
      });
    };
    function uniquearray(origArr) {
      var newArr = [],
        origLen = origArr.length,
        found,
        x,
        y;

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
