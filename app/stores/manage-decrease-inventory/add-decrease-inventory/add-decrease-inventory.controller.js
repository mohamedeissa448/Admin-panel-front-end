(function() {
  "use strict";

  angular
    .module("stores")
    .controller("AddDecreaseInventoryController", AddDecreaseInventoryController);

  /* @ngInject */
  function AddDecreaseInventoryController(
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
      url: "http://localhost:4000/getProducts",
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

    

    vm.DecreaseInventory_Products = [];
    vm.AddDecreaseInventoryProduct = function() {
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
        vm.Cost == "" ||
        vm.Price == undefined ||
        vm.Price == ""
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
          Cost: vm.Cost,
          Price : vm.Price
        };

        vm.DecreaseInventory_Products.push(IncreaseInventory_Product);
        console.log("IncreaseInventory_Product", IncreaseInventory_Product);

        vm.selectedProduct = null;
        vm.Origin_Variant = "" ;
        vm.Expiration_Variant = "";
        vm.Quantity = "";
        vm.Cost = "";
        vm.Price = "";
      }
    }; 

    vm.DeleteDecreaseInventoryProduct = function(decreaseInventoryProduct) {
      console.log("decreaseInventoryProduct", decreaseInventoryProduct);
      vm.DecreaseInventory_Products.splice(vm.DecreaseInventory_Products.indexOf(decreaseInventoryProduct), 1);
      console.log("after delete decreaseInventoryProduct", vm.DecreaseInventory_Products);
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

    vm.CloseDecreaseInventory = function() {
      $mdDialog.hide();
    };
    vm.SubmitRequest = function() {
      triLoaderService.setLoaderActive(true);
      console.log("vm.logedUser",vm.logedUser);
      var dataToSend = {};
      dataToSend.DecreaseInventory_Date = vm.DecreaseInventory_Date ;
      dataToSend.DecreaseInventory_Note = vm.DecreaseInventory_Note ;
      dataToSend.DecreaseInventory_DoneBy_User = vm.logedUser.mongoID;
      dataToSend.DecreaseInventory_Products = vm.DecreaseInventory_Products;

      $http({
        method: "POST",
        url: "http://localhost:4000/decreaseInventory/addDecreaseInventory",
        data: dataToSend
      }).then(function(response) {
        triLoaderService.setLoaderActive(false);  
        if(response.data.message == true){
          showAddToast("Decrease Inventory Added Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later!", $mdToast)
        }
        $mdDialog.hide();
      });
    };
  }
})();
