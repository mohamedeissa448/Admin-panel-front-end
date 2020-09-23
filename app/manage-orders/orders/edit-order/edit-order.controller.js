(function() {
  "use strict";

  angular
    .module("manageorders")
    .controller("EditOrderController", EditOrderController);

  /* @ngInject */
  function EditOrderController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService,
    orderId
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.Order_TotalProductCostAmount  = 0;
    vm.Order_TotalProductSellingAmount  = 0;
    

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http({
      method: "post",
      url: "http://localhost:4000/orders/getOneById",
      data: {_id : orderId }
    }).then(function(response) {
      vm.Order_Code = response.data.Order_Code ;
      vm.Order_Date = new Date ( response.data.Order_Date );
      vm.Order_SysDate = response.data.Order_SysDate ;
      vm.Order_Note = response.data.Order_Note ;
      vm.Order_Customer = response.data.Order_Customer._id ;
      vm.Order_TotalProductSellingAmount = response.data.Order_TotalProductSellingAmount ;
      vm.Order_TotalProductCostAmount = response.data.Order_TotalProductCostAmount ;
      vm.Order_Products = [];
      var modifiedProduct = {}
      angular.forEach(response.data.Order_Products, function(element, key) {
         modifiedProduct = {}
        if(element.Product){ 
          modifiedProduct = {
            Product            : element.Product._id,
            Product_Name       : element.Product.Product_Name,
            Origin_Variant     : element.Origin_Variant._id,
            ProductOrigin_Name : element.Origin_Variant.ProductOrigin_Name ,
            Expiration_Variant : element.Expiration_Variant,
            Quantity           : element.Quantity,
            Cost               : element.Cost,
            Price              : element.Price,
            isAlreadyOrdered   : true //it means it was added when order was first time created
          }
          vm.Order_Products.push(modifiedProduct);
        }
      });
     
      vm.selectedCustomers = [];
      vm.selectedCustomers.push({
        _id : response.data.Order_Customer._id , 
        Customer_Name : response.data.Order_Customer.Customer_Name,
        Customer_Code : response.data.Order_Customer.Customer_Code

      })
    });

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http.get("http://35.246.143.96:3111/getCustomer").then(function (response) {			   
            vm.selectedCustomerItem = null;
            vm.searchCustomerText = null;
            vm.queryCustomers = queryCustomers;
            vm.AllCustomers = response.data;
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
    $http({
      method: "get",
      url: "http://35.246.143.96:3111/getProducts",
      data: {}
    }).then(function(data) {
      vm.Productslist = data.data;
    });
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

    $http({
      method: "get",
      url: "http://localhost:4000/getOriginVariants",
    }).then(function(response) {
      vm.productOriginVariants = response.data;
    });

    vm.AddOrderProduct = function() {
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
        vm.Cost == ""  ||
        vm.Price == undefined ||
        vm.Price == ""
      ) {
        showAddErrorToast("You must Fill all product data", $mdToast);
      } else {
        console.log("vm.selectedProduct", vm.selectedProduct);

        var Order_Product = {
          Product: vm.selectedProduct._id,
          Product_Name :vm.selectedProduct.Product_Name, //only needed to be shown on table
          Origin_Variant: JSON.parse(vm.Origin_Variant)._id,
          ProductOrigin_Name : JSON.parse(vm.Origin_Variant).ProductOrigin_Name, //only needed to be shown on table
          Expiration_Variant: vm.Expiration_Variant,
          Quantity: vm.Quantity,
          Cost: vm.Cost,
          Price: vm.Price
        };

        vm.Order_Products.push(Order_Product);
        console.log("Order_Product", Order_Product);
        vm.Order_TotalProductCostAmount    +=  (vm.Quantity * vm.Cost);
        vm.Order_TotalProductSellingAmount +=  (vm.Quantity * vm.Price);

        vm.selectedProduct = null;
        vm.Origin_Variant = "" ;
        vm.Expiration_Variant = "";
        vm.Quantity = "";
        vm.Cost = "";
        vm.Price = "";
      }
    }; 

    vm.DeleteOrderProduct = function(orderProduct) {
      console.log("orderProduct", orderProduct);
      if(orderProduct.isAlreadyOrdered){
        var dataToSend = {
          orderId         : orderId,
          deletedProduct :{
            Product            : orderProduct.Product ,
            Origin_Variant     : orderProduct.Origin_Variant ,
            Expiration_Variant : orderProduct.Expiration_Variant ,
            Quantity           : orderProduct.Quantity,
            Price           : orderProduct.Price,
            Cost           : orderProduct.Cost
          }
        }
        $http({
          method: "POST",
          url: "http://localhost:4000/orders/deleteProductInOrder",
          data: dataToSend
        }).then(function(response) {
          triLoaderService.setLoaderActive(false);  
          if(response.data.message == true){
            showAddToast("Deleted Successfully", $mdToast);
            vm.Order_Products.splice(vm.Order_Products.indexOf(orderProduct), 1);
            console.log("after delete orderProduct", vm.Order_Products);
            vm.Order_TotalProductCostAmount    -=  (orderProduct.Quantity * orderProduct.Cost)
            vm.Order_TotalProductSellingAmount -=  (orderProduct.Quantity * orderProduct.Price);
    
          }else{
            showAddErrorToast("Couldn't Deleted,Please try again later!", $mdToast)
          }
        });
      }else{
        showAddToast("Deleted Successfully", $mdToast);
        vm.Order_Products.splice(vm.Order_Products.indexOf(orderProduct), 1);
        console.log("after delete orderProduct", vm.Order_Products);
        vm.Order_TotalProductCostAmount    -=  (orderProduct.Quantity * orderProduct.Cost)
        vm.Order_TotalProductSellingAmount -=  (orderProduct.Quantity * orderProduct.Price);
  
      }
    };


    vm.CloseOrder = function() {
      $mdDialog.hide();
    };
    vm.SubmitRequest = function() {
      triLoaderService.setLoaderActive(true);
      console.log("vm.logedUser",vm.logedUser);
      console.log("vm.selectedSuppliers",vm.selectedSuppliers);
      var dataToSend = {};
      dataToSend._id = orderId ;
      dataToSend.Order_Date = vm.Order_Date ;
      dataToSend.Order_Note = vm.Order_Note ;
      dataToSend.Order_TotalProductSellingAmount = vm.Order_TotalProductSellingAmount;
      dataToSend.Order_TotalProductCostAmount = vm.Order_TotalProductCostAmount ;
      dataToSend.Order_Customer = vm.selectedCustomers[0]._id ;
      dataToSend.Order_Products = vm.Order_Products;
      dataToSend.Order_DoneBy_User = vm.logedUser.mongoID;

      $http({
        method: "POST",
        url: "http://localhost:4000/orders/editOrder",
        data: dataToSend
      }).then(function(response) {
        triLoaderService.setLoaderActive(false);  
        if(response.data.message == true){
          showAddToast("Order Added Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later!", $mdToast)
        }
        $mdDialog.hide();
      });
    }; 
    
    
  }
})();
