(function() {
  "use strict";

  angular
    .module("stores")
    .controller("EditStoreController", EditStoreController);

  /* @ngInject */
  function EditStoreController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService,
    itemToEdit
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.ProductStore = {};
    console.log("itemToEdit",itemToEdit)
    vm.itemToEdit=itemToEdit
   /* $http.get("http://35.246.143.96:3111getAllSupplier").then(function (response) {			   
      vm.selectedSupplierItem = null;
      vm.searchSupplierText = null;
      vm.querySuppliers = querySuppliers;
      vm.Suppliers = response.data;
      vm.Supplierslist = response.data;
      vm.selectedSuppliers = [];
      vm.transformChip = transformChip;   
      function querySuppliers($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Suppliers.filter(function(supplier) {
              var lowercaseName = angular.lowercase(supplier.Supplier_Name);
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return supplier;
              }
          });
      }
      ///console.log(vm.selectedSuppliers);
  });*/
  $http({
    method:"post",
    url:"http://35.246.143.96:3111/getOneStoreProductById",
    data: {_id:itemToEdit._id}
  }).then(function (response) {	
    console.log("store product",response.data)
    vm.selectedProducts = [];
        //initialize form fields
      vm.selectedProducts[0]=response.data.Product_Purchasing_ID;
      vm.ProductStore.Product_Storing_Date= new Date(response.data.Product_Storing_Date)
      vm.Product_Incoming_HighChem_Permission_Number=response.data.Product_Incoming_HighChem_Permission_Number;
      vm.Extra1 = response.data.Extra1;
      vm.Extra2 = response.data.Extra2;
      vm.Extra3 = response.data.Extra3;
      vm.Extra4 = response.data.Extra4;
      vm.Extra5 = response.data.Extra5;
  }).then(function(){
    $http.get("http://35.246.143.96:3111/getAllPurchasings").then(function (response) {	
      console.log("purchasings",response)
        vm.selectedProductItem = null;
        vm.searchProductText = null;
        vm.queryProducts = queryProducts;
        vm.Products = response.data;
        vm.Productslist = response.data;
        
        vm.transformChip = transformChip;   
        function queryProducts($query) {
            var lowercaseQuery = angular.lowercase($query);
            return vm.Products.filter(function(product) {
                var lowercaseName = angular.lowercase(product.Product_Name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return product;
                }
            });
        }
        ///console.log(vm.selectedSuppliers);
    })
    .then(function(){
      $http.get("http://35.246.143.96:3111/getCountries").then(function (response) {			   
          vm.countries = response.data;
      }).then(function () {			   
        $http.get("http://35.246.143.96:3111/getManufacturer").then(function (response) {			   
            vm.Manufacturers = response.data;
    })
    })
  })
  })
 
vm.searchForManufacturer = function(query) {
  var lowercaseQuery = angular.lowercase(query);
  var results = vm.Manufacturers.filter( function(manufacturer) {
          var lowercaseName = angular.lowercase(manufacturer.Supplier_Name);
           if(manufacturer.Supplier_Name != undefined){
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return manufacturer;
              }
          }
      }
  );
  return results;
}; 
vm.manufacturerChanged = function(item){
  if(item)
      vm.selectedManufacturerText = item.Supplier_Name;
  else
      vm.selectedManufacturerText = '';
}

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }


    $http.get("http://35.246.143.96:3111/getWeight").then(function(data) {
      vm.WeightUnitsList = data.data;
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

    vm.CloseStoreProduct = function() {
      $mdDialog.hide();
    };
    vm.SubmitStoring = function() {
      console.log("difference",Math.abs(new Date(vm.ProductStore.Product_Storing_Date ) - new Date(vm.selectedProducts[0].Product_Purchasing_Date)))
       //calculate storing day
       if (!String.prototype.format) {
        String.prototype.format = function() {
          return this.replace(/(\{\d+\})/g, function(a) {
            return args[+(a.substr(1, a.length - 2)) || 0];
          });
        };
      }
      var todayTime = new Date(vm.ProductStore.Product_Storing_Date);
      var storingDay = todayTime.getDate(); 
      console.log('storing day',storingDay)
      var currentDay = new Date().getDate();
      console.log('current day ',currentDay)

      if(Math.abs(new Date(vm.ProductStore.Product_Storing_Date ) - new Date(vm.selectedProducts[0].Product_Purchasing_Date)) > 0){
        showAddErrorToast("Storing date is less than purchasing date",$mdToast);
      }else if(storingDay > currentDay){
        showAddErrorToast("Storing day is greater than current day",$mdToast);
      }
      else{
      triLoaderService.setLoaderActive(true);
      console.log("vm.selectedProduct_Manufacturer",vm.selectedProduct_Manufacturer)
      console.log("vm.selectedProducts",vm.selectedProducts)
      console.log("vm.selectedSuppliers",vm.selectedSuppliers)
      vm.ProductStore.Store_Code =1; //always 1 for store number 1
      vm.ProductStore.Store_Name="Original";//name from my choice
      vm.ProductStore.Product_Purchasing_ID= vm.selectedProducts[0]._id;
      vm.ProductStore.Product_Incoming_HighChem_Permission_Number=vm.Product_Incoming_HighChem_Permission_Number;
      vm.ProductStore.Product_Current_Quantity = vm.selectedProducts[0].Product_Quantity ;
      vm.ProductStore.Extra1=vm.Extra1
      vm.ProductStore.Extra2=vm.Extra2
      vm.ProductStore.Extra3=vm.Extra3
      vm.ProductStore.Extra4=vm.Extra4
      vm.ProductStore.Extra5=vm.Extra5

      vm.ProductStore.StoreProduct_CreatedByUser = vm.logedUser.mongoID;
      //only useful for searches
      vm.ProductStore.Product_Code= vm.selectedProducts[0].Product_Code ;
      vm.ProductStore.Product_Name= vm.selectedProducts[0].Product_Name;
      vm.ProductStore.Supplier_Code= vm.selectedProducts[0].Supplier_Code ;
      vm.ProductStore.Supplier_Name= vm.selectedProducts[0].Supplier_Name ;
      vm.ProductStore.Product_Incoming_Bill_Number=vm.selectedProducts[0].Product_Incoming_Bill_Number
      vm.ProductStore.Product_Incoming_Supplier_Permission_Number=vm.selectedProducts[0].Product_Incoming_Supplier_Permission_Number
      vm.ProductStore.Product_BatchNumber=vm.selectedProducts[0].Product_BatchNumber;
      vm.ProductStore.Product_Origin_Country_Code = vm.selectedProducts[0].Product_Origin_Country_Code
      vm.ProductStore.Product_Number_Of_Packages =  vm.selectedProducts[0].Product_Number_Of_Packages;
      vm.ProductStore.Product_Date_Of_Expiration = vm.selectedProducts[0].Product_Date_Of_Expiration

      console.log("product_Store",vm.ProductStore)
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111editStoreProductByID",
        data: {
           ProductStore: vm.ProductStore,
           _id: itemToEdit._id
           }
      }).then(function(data) {
        console.log("data",data)
        if(data.data.message==true){
          vm.ProductStore = {};
        showAddToast("Store's product updated Successfully", $mdToast);
        }else{
          showAddErrorToast("Something went wrong,Please try again later",$mdToast);
        }
        triLoaderService.setLoaderActive(false);
        $mdDialog.hide()
      });
    }
    };
  }
})();
