(function() {
  "use strict";

  angular
    .module("stores")
    .controller("AddIncreaseInventoryController", AddIncreaseInventoryController);

  /* @ngInject */
  function AddIncreaseInventoryController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }

    $http({
      method: "get",
      url: "http://35.246.143.96:3111/getProducts",
      data: {}
    }).then(function(data) {
      vm.Productslist = data.data;
    });

    $http({
      method: "get",
      url: "http://localhost:4000/getOriginVariants",
    }).then(function(response) {
      vm.productOriginVariants = response.data;
    });

    

    vm.IncreaseInventory_Products = [];
    vm.AddIncreaseInventoryProduct = function() {
      console.log("vm.productsearchText", vm.productsearchText);
      if (
        !vm.productsearchText ||
        vm.Origin_Variant == undefined ||
        vm.Origin_Variant == "" ||
        vm.Expiration_Variant == undefined ||
        vm.Expiration_Variant == "" ||
        vm.Quantity == undefined ||
        vm.Quantity == "" ||
        vm.Cost == undefined ||
        vm.Cost == ""
      ) {
        showAddErrorToast("You must Fill all product data", $mdToast);
      } else {
        console.log("vm.selectedProduct", vm.selectedProduct);

        var IncreaseInventory_Product = {
          Product: vm.selectedProduct._id,
          Product_Name :vm.selectedProduct.Product_Name, //only needed to be shown on table
          Origin_Variant: JSON.parse(vm.Origin_Variant)._id,
          ProductOrigin_Name : JSON.parse(vm.Origin_Variant).ProductOrigin_Name, //only needed to be shown on table
          Expiration_Variant: vm.Expiration_Variant,
          Quantity: vm.Quantity,
          Cost: vm.Cost
        };

        vm.IncreaseInventory_Products.push(IncreaseInventory_Product);
        console.log("IncreaseInventory_Product", IncreaseInventory_Product);

        vm.selectedProduct = null;
        vm.Origin_Variant = "" ;
        vm.Expiration_Variant = "";
        vm.Quantity = "";
        vm.Cost = "";
      }
    }; 

    vm.DeleteIncreaseInventoryProduct = function(increaseInventoryProduct) {
      console.log("productOrder", increaseInventoryProduct);
      vm.IncreaseInventory_Products.splice(vm.IncreaseInventory_Products.indexOf(increaseInventoryProduct), 1);
      console.log("after delete increaseInventoryProduct", vm.IncreaseInventory_Products);
    };


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

    vm.CloseIncreaseInventory = function() {
      $mdDialog.hide();
    };
    vm.SubmitRequest = function() {
      triLoaderService.setLoaderActive(true);
      console.log("vm.logedUser",vm.logedUser);
      var dataToSend = {};
      dataToSend.IncreaseInventory_Date = vm.IncreaseInventory_Date ;
      dataToSend.IncreaseInventory_Note = vm.IncreaseInventory_Note ;
      dataToSend.IncreaseInventory_DoneBy_User = vm.logedUser.mongoID;
      dataToSend.IncreaseInventory_Products = vm.IncreaseInventory_Products;

      $http({
        method: "POST",
        url: "http://localhost:4000/increaseInventory/addIncreaseInventory",
        data: dataToSend
      }).then(function(response) {
        triLoaderService.setLoaderActive(false);  
        if(response.data.message == true){
          showAddToast("Increase Inventory Added Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later!", $mdToast)
        }
        $mdDialog.hide();
      });
    };
  }
})();
