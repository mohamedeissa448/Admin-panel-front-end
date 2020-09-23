(function() {
  "use strict";

  angular
    .module("managecustomers")
    .controller("EditCustomerController", EditCustomerController);

  /* @ngInject */
  function EditCustomerController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();

    vm.CustomerData = ItemToEdit;
    console.log("ItemToEdit",ItemToEdit)
    vm.selectedCat = vm.CustomerData.Category;
    vm.selectedSupplierTypes = vm.CustomerData.CustomerType;
    vm.selectedPaymentMethods = vm.CustomerData.PaymentMethod;
    if(!vm.selectedPaymentMethods){
      vm.selectedPaymentMethods = [];
    }
    vm.selectedWaysOfDelivery = vm.CustomerData.WayOfDeliver;
    if(!vm.selectedWaysOfDelivery){
      vm.selectedWaysOfDelivery = [];
    }
    vm.selectedAgencies = vm.CustomerData.Customer_Agencies;
    if(!vm.selectedAgencies){
      vm.selectedAgencies = [];
    }
    vm.selectedCertificates = vm.CustomerData.Customer_Certificates;
    if(!vm.selectedCertificates){
      vm.selectedCertificates = [];
    }
    if (vm.CustomerData.Customer_IsActive == 1) {
      vm.CustomerStatus = true;
    } else {
      vm.CustomerStatus = false;
    }

    $http
      .get("http://35.246.143.96:3111/getCountries")
      .then(function(response) {
        vm.countries = response.data;
      });
    $http.get("http://35.246.143.96:3111/getClasses").then(function(response) {
      vm.classes = response.data;
    });
    $http
      .get("http://35.246.143.96:3111/getCategories")
      .then(function(response) {
        vm.selectedCatItem = null;
        vm.searchCatText = null;
        vm.queryCats = queryCats;
        vm.Categories = response.data;
        vm.transformChip = transformChip;
        function queryCats($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Categories.filter(function(cat) {
            var lowercaseName = angular.lowercase(cat.Category_Name);
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return cat;
            }
          });
        }
      });

    $http
      .get("http://35.246.143.96:3111/getSupplierTypes")
      .then(function(response) {
        vm.selectedSupplTypeItem = null;
        vm.searchSupplTypeText = null;
        vm.querySupplTypes = querySupplTypes;
        vm.SupplierTypes = response.data;
        vm.transformChip = transformChip;
        function querySupplTypes($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.SupplierTypes.filter(function(suppliertypes) {
            var lowercaseName = angular.lowercase(
              suppliertypes.SupplierType_Name
            );
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return suppliertypes;
            }
          });
        }
      });

    $http
      .get("http://35.246.143.96:3111/getPaymentMethods")
      .then(function(response) {
        vm.selectedPayMethItem = null;
        vm.searchPayMethIText = null;
        vm.queryPayMeths = queryPayMeths;
        vm.PaymentMethods = response.data;
        vm.transformChip = transformChip;
        function queryPayMeths($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.PaymentMethods.filter(function(paymentmethods) {
            var lowercaseName = angular.lowercase(
              paymentmethods.PaymentMethod_Name
            );
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return paymentmethods;
            }
          });
        }
      });

    $http
      .get("http://35.246.143.96:3111/getWaysOfDelivery")
      .then(function(response) {
        vm.selectedWayOfDelItem = null;
        vm.searchWayOfDelText = null;
        vm.queryWayOfDels = queryWayOfDels;
        vm.WaysOfDelivery = response.data;
        vm.transformChip = transformChip;
        function queryWayOfDels($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.WaysOfDelivery.filter(function(waysofdelivery) {
            var lowercaseName = angular.lowercase(
              waysofdelivery.WayOfDelivary_Name
            );
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return waysofdelivery;
            }
          });
        }
      });

      //start product caregories
      $http
      .get("http://35.246.143.96:3111/getProductCategory")
      .then(function(response) {
        vm.selectedProdCatItem = null;
        vm.selectedProductCertiItem = null;
        vm.selectedStorageCondItem = null;
        vm.searchProdCatText = null;
        vm.searchProdCertiText = null;
        vm.searchStorageCondText = null;
        vm.queryProdCats = queryProdCats;
        vm.queryStorageConds = queryStorageConds;
        vm.queryProdCertis = queryProdCertis;
        vm.ProductCategories = response.data;
        vm.isLoading = false;
        if (vm.CustomerData.productcategory) {
          vm.selectedProductCategories = vm.CustomerData.productcategory;
        } else {
          vm.selectedProductCategories = [];
        }
        if (vm.CustomerData.productstrage) {
          vm.selectedStorageConditions = vm.CustomerData.productstrage;
        } else {
          vm.selectedStorageConditions = [];
        }
        if (vm.CustomerData.certification) {
          vm.selectedProductCertificates = vm.CustomerData.certification;
        } else {
          vm.selectedProductCertificates = [];
        }

        vm.transformChip = transformChip;
        function queryProdCats($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.ProductCategories.filter(function(productcategories) {
            var lowercaseName = angular.lowercase(
              productcategories.ProductCategory_Name
            );
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return productcategories;
            }
          });
        }
        function queryStorageConds($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.storages.filter(function(storageCond) {
            var lowercaseName = angular.lowercase(
              storageCond.StorageType_Name
            );
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return storageCond;
            }
          });
        }
        function queryProdCertis($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Certificates.filter(function(productCertificates) {
            var lowercaseName = angular.lowercase(
              productCertificates.Certificate_Name
            );
            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
              return productCertificates;
            }
          });
        }
      })//start Selling Areas
      .then(function() {
          $http.get("http://35.246.143.96:3111/getSellingArea").then(function (response) {			   
              vm.selectedSeelAreaItem = null;
              vm.selectedProductCertiItem = null;
              vm.selectedStorageCondItem = null;
              vm.searchSeelAreaText = null;
              vm.searchProdCertiText = null
              vm.searchStorageCondText = null;
              vm.querySeelAreas = querySeelAreas;
              vm.queryProdCertis = queryProdCertis;
              vm.queryStorageConds = queryStorageConds;
              vm.SellingAreas = response.data;
              vm.selectedSellingAreas = [];
              vm.selectedProductCertificates = [];
              vm.transformChip = transformChip;  
              vm.isLoading = false; 
              if (vm.CustomerData.sellingArea) {
                vm.selectedSellingAreas = vm.CustomerData.sellingArea;
              } else {
                vm.selectedSellingAreas = [];
              }
              function querySeelAreas($query) {
                  var lowercaseQuery = angular.lowercase($query);
                  return vm.SellingAreas.filter(function(SellingAreas) {
                      var lowercaseName = angular.lowercase(SellingAreas.SellingArea_Name);
                      if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                          return SellingAreas;
                      }
                  });
              }
              function queryStorageConds($query) {
                  var lowercaseQuery = angular.lowercase($query);
                  return vm.storages.filter(function(storageCond) {
                      var lowercaseName = angular.lowercase(storageCond.StorageType_Name);
                      if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                          return storageCond;
                      }
                  });
              }
              function queryProdCertis($query) {
                  var lowercaseQuery = angular.lowercase($query);
                  return vm.Certificates.filter(function(productCertificates) {
                      var lowercaseName = angular.lowercase(productCertificates.Certificate_Name);
                      if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                          return productCertificates;
                      }
                  });
              }
              
          })
      })
  
    vm.isLoading = false;
    vm.CloseForm = function() {
      if (vm.EditCustomerForm.$dirty) {
        ConfirmCloseDialog();
      } else {
        $mdDialog.hide();
      }
    };
    function ConfirmCloseDialog() {
      var Result;
      $mdDialog
        .show({
          multiple: true,
          skipHide: true,
          controllerAs: "confirmDialog",
          bindToController: true,
          controller: function($mdDialog) {
            var vmc = this;
            vmc.closeform = function closeform() {
              $mdDialog.hide();
              Result = true;
            };
            vmc.hide = function hide() {
              $mdDialog.hide();
              Result = false;
            };
          },
          template: GetConfirmCloseTemplate()
        })
        .then(function() {
          if (Result) {
            $mdDialog.hide();
          }
        });
    }
    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }

    vm.SubmitData = function(form) {
      var hasAnError;
      if(vm.selectedCat.length ==0){
          vm.categoryError = true;
          hasAnError = true;
      } 
      else{
          vm.categoryError = false;
      }
      if(vm.selectedSupplierTypes.length ==0){
          vm.BusinessTypeError = true;
          hasAnError = true;
      } 
      else{
          vm.BusinessTypeError = false;
      }
      if(!hasAnError){
        vm.isLoading = true;
        if (vm.CustomerStatus == true) {
          vm.CustomerData.Customer_IsActive = 1;
        } else {
          vm.CustomerData.Customer_IsActive = 0;
        }
        vm.CustomerData.Customer_PaymentMethod_Codes = [];
        vm.selectedPaymentMethods.forEach(function(element) {
          vm.CustomerData.Customer_PaymentMethod_Codes.push(
            element.PaymentMethod_Code
          );
        });
        vm.CustomerData.Customer_WayOfDelivery_Codes = [];
        vm.selectedWaysOfDelivery.forEach(function(element) {
          vm.CustomerData.Customer_WayOfDelivery_Codes.push(
            element.WayOfDelivary_Code
          );
        });
        vm.CustomerData.Customer_SupplierType_Codes = [];
        vm.selectedSupplierTypes.forEach(function(element) {
          vm.CustomerData.Customer_SupplierType_Codes.push(
            element.SupplierType_Code
          );
        });
        vm.CustomerData.Customer_Category_IDs = [];
        vm.selectedCat.forEach(function(element) {
          vm.CustomerData.Customer_Category_IDs.push(element.Category_ID);
        });

         //product Categories
         vm.CustomerData.Customer_ProductCategory_Code = [];
         vm.selectedProductCategories.forEach(function(element) {
           vm.CustomerData.Customer_ProductCategory_Code.push(
             element.ProductCategory_Code
           );
         });
          //selling Areas
          vm.CustomerData.Customer_SellingAreaCodes = [];
          vm.CustomerData.Customer_SellingAreaNames = [];
          vm.selectedSellingAreas.forEach(function(element){
              vm.CustomerData.Customer_SellingAreaCodes.push(element.SellingArea_Code) ;
              vm.CustomerData.Customer_SellingAreaNames.push(element.SellingArea_Name) ;
          })

        vm.CustomerData.Customer_Certificates = [];
        vm.selectedCertificates.forEach(function(element) {
          vm.CustomerData.Customer_Certificates.push(element);
        });
        vm.CustomerData.Customer_Agencies = [];
        vm.selectedAgencies.forEach(function(element) {
          vm.CustomerData.Customer_Agencies.push(element);
        });

        vm.CustomerData["User_Code"] = vm.logedUser.id;
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/EditCustomer", //35.246.143.96:3111
          data: vm.CustomerData
        }).then(function(data) {
          vm.isLoading = true;
          showAddToast("Customer Edited successfully", $mdToast);
          $mdDialog.hide();
        });
      };
    }
  }
})();
