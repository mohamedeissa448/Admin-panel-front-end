(function() {
  "use strict";

  angular
    .module("customerorder")
    .controller("AddCustomerOrderController", AddCustomerOrderController);

  /* @ngInject */
  function AddCustomerOrderController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.SendOrder = {};
    $http
      .get("http://35.246.143.96:3111/getAllCustomer")
      .then(function(response) {
        vm.selectedcustomeritem = null;
        vm.searchCustomerText = null;
        vm.queryCustomers = queryCustomers;
        vm.x = response.data;
        vm.Customers = response.data; //vm.Customers = [];
        // vm.Customers.push(vm.x[0]);
        vm.Customerslist = response.data;
        vm.selectedCustomers = [];
        vm.transformChip = transformChip;

        function queryCustomers($query) {
          console.log("vm.Customers", vm.Customers);
          var lowercaseQuery = angular.lowercase($query);
          return vm.Customers.filter(function(Customer) {
            var lowercaseName = angular.lowercase(Customer.Customer_Name);
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return Customer;
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

    $http({
      method: "get",
      url: "http://35.246.143.96:3111/getProducts",
      data: {}
    }).then(function(data) {
      vm.Productslist = data.data;
    });

    $http.get("http://35.246.143.96:3111/getWeight").then(function(data) {
      vm.WeightUnitsList = data.data;
    });

    vm.productOrders = [];
    vm.productOrder = [];
    vm.AddproductOrder = function() {
      console.log("vm.productsearchText", vm.productsearchText);
      if (
        !vm.productsearchText ||
        vm.SendOrder_Amount == undefined ||
        vm.SendOrder_Amount == "" ||
        vm.SendOrder_Units == undefined ||
        vm.SendOrder_Units == "" ||
        vm.Order_Note == undefined ||
        vm.Order_Note == ""
      ) {
        showAddErrorToast("You must Fill all product data", $mdToast);
      } else {
        console.log("vm.selectedProduct", vm.selectedProduct);
        console.log("vm.SendOrder_Units", vm.SendOrder_Units);
        var Order_Product;
        var Product_Name;
        var Product_ID;
        if (vm.selectedProduct) {
          Order_Product = vm.selectedProduct._id;
          Product_Name = vm.selectedProduct.Product_Name;
          Product_ID = vm.selectedProduct.Product_Code;
        } else {
          Order_Product = null;
          Product_Name = vm.productsearchText;
          Product_ID = null;
        }

        var productOrder = {
          Order_Product: Order_Product,
          Product_Name: Product_Name,
          Product_ID: Product_ID,
          Order_RequestedQuantity: vm.SendOrder_Amount,
          SendOrder_Amount: vm.SendOrder_Amount,
          Weight_Name: vm.SendOrder_Units.Weight_Name,
          Quantity_Required: vm.SendOrder_Amount,
          Weight_ID: vm.SendOrder_Units.Weight_Code,
          Order_RequestedQuantityWeightUnit: vm.SendOrder_Units._id,
          Order_Note: vm.Order_Note
        };

        vm.productOrders.push(productOrder);
        console.log(productOrder);

        vm.selectedProduct = null;
        vm.SendOrder_Amount = "";
        vm.SendOrder_Units = "";
        vm.Order_Note = "";
      }
    };

    vm.FilterCustomerByProduct = function() {
      $mdDialog
        .show({
          multiple: true,
          skipHide: true,
          controller: "GetCustomersByProductController",
          controllerAs: "vmr",
          templateUrl:
            "app/send-offer/add-send-offer/get-customer-by-product.tmpl.html",
          clickOutsideToClose: true,
          focusOnOpen: false,
          locals: {
            productlist: vm.Productslist
          }
          //targetEvent: $event,
          // onRemoving: function (event, removePromise) {
          //     vm.RequestGrid.innerHTML = "";
          // }
        })
        .then(
          function(listOfSelectedCustomers) {
            console.log(listOfSelectedCustomers);
            console.log(vm.selectedCustomers);

            vm.selectedCustomers = listOfSelectedCustomers;
            console.log(vm.selectedCustomers);
          },
          function() {
            console.log("You cancelled the dialog.");
          }
        );
    };

    vm.DeleteRequest = function(productOrder) {
      console.log("productOrder", productOrder);
      vm.productOrders.splice(vm.productOrders.indexOf(productOrder), 1);
      console.log("after delete productOrders", vm.productOrders);
    };

    vm.searchForCustomer = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      var results = vm.Customerslist.filter(function(customer) {
        var lowercaseName = angular.lowercase(customer.Customer_Name);
        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
          return customer;
        }
      });
      return results;
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

    vm.CloseSendOrder = function() {
      $mdDialog.hide();
    };
    vm.SubmitRequest = function() {
      triLoaderService.setLoaderActive(true);
      var CustomerOrder_Products = [];
      angular.forEach(vm.productOrders, function(element, key) {
        console.log("e", element, "key", key);
        CustomerOrder_Products.push({
          Order_Product_Name: element.Product_Name,
          Order_Product: element.Order_Product,
          Order_RequestedQuantity: element.Order_RequestedQuantity,
          Order_RequestedQuantityWeightUnit:
            element.Order_RequestedQuantityWeightUnit,
          Order_Note: element.Order_Note
        });
      });

      console.log("vm.productOrders", vm.productOrders);
      console.log("vm.selectedCustomers", vm.selectedCustomers);

      vm.SendOrder.CustomerOrder_Customer = vm.selectedCustomers[0]["_id"];
      vm.SendOrder.CustomerOrder_CreatedByUser = vm.logedUser.mongoID;
      vm.SendOrder.CustomerOrder_Status = 1;
      vm.SendOrder.CustomerOrder_Products = CustomerOrder_Products;
      console.log("vm.SendOrder", vm.SendOrder);

      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/addCustomerOrder",
        data: { order: vm.SendOrder }
      }).then(function(data) {
        vm.productOrders = [];
        vm.productOrder = [];
        vm.selectedCustomer = null;
        vm.selectedCustomers = {};
        showAddToast("Request Order Added Successfully", $mdToast);
        triLoaderService.setLoaderActive(false);
      });
    };
  }
})();
