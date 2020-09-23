(function() {
  "use strict";

  angular
    .module("manage-bills")
    .controller("AddSupplierReturnBillController", AddSupplierReturnBillController);

  /* @ngInject */
  function AddSupplierReturnBillController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.Bill_TotalAmount  = 0;

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http.get("http://35.246.143.96:3111/getSupplier").then(function (response) {			   
            vm.selectedSupplierItem = null;
            vm.searchSupplierText = null;
            vm.querySuppliers = querySuppliers;
            vm.AllSuppliers = response.data;
            vm.selectedSuppliers = [];
            vm.transformChip = transformChip;   
            function querySuppliers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.AllSuppliers.filter(function(suplier) {
                    var lowercaseName = angular.lowercase(suplier.Supplier_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return suplier;
                    }
                });
            }
            
    });
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

    

    vm.BillReturn_Products = [];
    vm.AddBillProduct = function() {
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

        var Bill_Product = {
          Product: vm.selectedProduct._id,
          Product_Name :vm.selectedProduct.Product_Name, //only needed to be shown on table
          Origin_Variant: JSON.parse(vm.Origin_Variant)._id,
          ProductOrigin_Name : JSON.parse(vm.Origin_Variant).ProductOrigin_Name, //only needed to be shown on table
          Expiration_Variant: vm.Expiration_Variant,
          Quantity: vm.Quantity,
          Cost: vm.Cost,
          Price : vm.Price
        };

        vm.BillReturn_Products.push(Bill_Product);
        console.log("Bill_Product", Bill_Product);
        vm.Bill_TotalAmount = vm.Bill_TotalAmount + (vm.Quantity * vm.Cost)

        vm.selectedProduct = null;
        vm.Origin_Variant = "" ;
        vm.Expiration_Variant = "";
        vm.Quantity = "";
        vm.Cost = "";
        vm.Price = "";
      }
    }; 

    vm.DeleteBillProduct = function(billProduct) {
      console.log("billProduct", billProduct);
      vm.BillReturn_Products.splice(vm.BillReturn_Products.indexOf(billProduct), 1);
      console.log("after delete billProduct", vm.BillReturn_Products);
      vm.Bill_TotalAmount = vm.Bill_TotalAmount - (billProduct.Quantity * billProduct.Cost)

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

    vm.CloseBill = function() {
      $mdDialog.hide();
    };
    vm.SubmitRequest = function() {
      triLoaderService.setLoaderActive(true);
      console.log("vm.logedUser",vm.logedUser);
      console.log("vm.selectedSuppliers",vm.selectedSuppliers);
      var dataToSend = {};
      dataToSend.BillReturn_Date = vm.BillReturn_Date ;
      dataToSend.Bill_Supplier = vm.selectedSuppliers[0]._id ;
      dataToSend.BillReturn_Note = vm.BillReturn_Note ;
      dataToSend.BillReturn_DoneBy_User = vm.logedUser.mongoID;
      dataToSend.BillReturn_Products = vm.BillReturn_Products;
      dataToSend.Bill_TotalAmount = vm.Bill_TotalAmount;
      $http({
        method: "POST",
        url: "http://localhost:4000/supplier-return-bill/addBill",
        data: dataToSend
      }).then(function(response) {
        triLoaderService.setLoaderActive(false);  
        if(response.data.message == true){
          showAddToast("Return Bill Added Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later!", $mdToast)
        }
        $mdDialog.hide();
      });
    };
  }
})();
