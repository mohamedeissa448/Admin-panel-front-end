(function() {
  "use strict";

  angular
    .module("managesuppliers")
    .controller("EditSupplierController", EditSupplierController);

  /* @ngInject */
  function EditSupplierController(
    $mdToast,
    $mdDialog,
    UserService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.isLoading = true;
    vm.SupplierData = ItemToEdit;
    vm.supplier_code = {};
    vm.supplier_code.Supplier_Code = ItemToEdit.Supplier_Code;
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
      })

      .then(function() {
        $http
          .get("http://35.246.143.96:3111/getCountries")
          .then(function(response) {
            vm.countries = response.data;
          })
          .then(function() {
            $http
              .get("http://35.246.143.96:3111/getClasses")
              .then(function(response) {
                vm.classes = response.data;
              })
              .then(function() {
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
                  })
                  .then(function() {
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
                          return vm.PaymentMethods.filter(function(
                            paymentmethods
                          ) {
                            var lowercaseName = angular.lowercase(
                              paymentmethods.PaymentMethod_Name
                            );
                            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                              return paymentmethods;
                            }
                          });
                        }
                      })
                      .then(function() {
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
                              return vm.WaysOfDelivery.filter(function(
                                waysofdelivery
                              ) {
                                var lowercaseName = angular.lowercase(
                                  waysofdelivery.WayOfDelivary_Name
                                );
                                if (
                                  lowercaseName.indexOf(lowercaseQuery) !== -1
                                ) {
                                  return waysofdelivery;
                                }
                              });
                            }
                          })
                          .then(function() {
                            $http({
                              method: "Post",
                              url: "http://35.246.143.96:3111/getSupplierById",
                              data: vm.supplier_code
                            })
                              .then(function(data) {
                                vm.SupplierData = data.data[0];
                                console.log(vm.SupplierData);
                                vm.selectedCat = vm.SupplierData.Category;
                                if (vm.SupplierData.SupplierType)
                                  vm.selectedSupplierTypes =
                                    vm.SupplierData.SupplierType;
                                else vm.selectedSupplierTypes = [];
                                if (vm.SupplierData.PaymentMethod)
                                  vm.selectedPaymentMethods =
                                    vm.SupplierData.PaymentMethod;
                                else vm.selectedPaymentMethods = [];
                                if (vm.SupplierData.WayOfDelivery)
                                  vm.selectedWaysOfDelivery =
                                    vm.SupplierData.WayOfDelivery;
                                else vm.selectedWaysOfDelivery = [];
                                vm.selectedAgencies =
                                  vm.SupplierData.Supplier_Agencies;
                                vm.selectedCertificates =
                                  vm.SupplierData.Supplier_Certificates;
                                if (vm.SupplierData.Supplier_IsActive == 1) {
                                  vm.SupplierStatus = true;
                                } else {
                                  vm.SupplierStatus = false;
                                }
                              })
                              .then(function() {
                                getProductCategories();
                                
                              });
                          });
                      });
                  });
              });
          });
      });

      function getProductCategories(){
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
            if (vm.SupplierData.productcategory) {
              vm.selectedProductCategories = vm.SupplierData.productcategory;
            } else {
              vm.selectedProductCategories = [];
            }
            if (vm.SupplierData.productstrage) {
              vm.selectedStorageConditions = vm.SupplierData.productstrage;
            } else {
              vm.selectedStorageConditions = [];
            }
            if (vm.SupplierData.certification) {
              vm.selectedProductCertificates = vm.SupplierData.certification;
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
                  if (vm.SupplierData.sellingArea) {
                    vm.selectedSellingAreas = vm.SupplierData.sellingArea;
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
      }
    vm.CloseForm = function() {
      if (vm.EditSupplierForm.$dirty) {
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

    vm.SubmitData = function() {
      if (
        vm.SupplierData.Supplier_IsManufacturer == false &&
        vm.SupplierData.Supplier_IsSupplier == false
      ) {
        showAddErrorToast(
          "You Have to Choose Organization Type, (is Supplier) or (is Manufacturer) or Both ",
          $mdToast
        );
      } else if (vm.selectedCat == undefined || vm.selectedCat.length == 0) {
        showAddErrorToast("You Have to Choose Category ", $mdToast);
      } else if (vm.SupplierData.Supplier_Class_Code == undefined) {
        showAddErrorToast("You Have to Choose Class ", $mdToast);
      } else {
        vm.isLoading = true;
        vm.SupplierMailTocheck = {};
        vm.SupplierMailTocheck.Supplier_Email = vm.SupplierData.Supplier_Email;
        vm.SupplierMailTocheck.Supplier_Code = vm.SupplierData.Supplier_Code;
        $http({
          method: "POST",
          url: "http://35.246.143.96:3111/checkSupplierByEmailAndID",
          data: vm.SupplierMailTocheck
        }).then(function(data) {
          if (data.data.length > 0) {
            showAddErrorToast(
              "The email address you have entered is already registered",
              $mdToast
            );
            vm.isLoading = false;
          } else {
            EditSupplier();
          }
        });
        function EditSupplier() {
          if (vm.SupplierStatus == true) {
            vm.SupplierData.Supplier_IsActive = 1;
          } else {
            vm.SupplierData.Supplier_IsActive = 0;
          }
          vm.SupplierData.Supplier_PaymentMethod_Codes = [];
          vm.selectedPaymentMethods.forEach(function(element) {
            vm.SupplierData.Supplier_PaymentMethod_Codes.push(
              element.PaymentMethod_Code
            );
          });
          vm.SupplierData.Supplier_WayOfDelivery_Codes = [];
          vm.selectedWaysOfDelivery.forEach(function(element) {
            vm.SupplierData.Supplier_WayOfDelivery_Codes.push(
              element.WayOfDelivary_Code
            );
          });
          vm.SupplierData.Supplier_SupplierType_Codes = [];
          vm.selectedSupplierTypes.forEach(function(element) {
            vm.SupplierData.Supplier_SupplierType_Codes.push(
              element.SupplierType_Code
            );
          });
          vm.SupplierData.Supplier_Category_IDs = [];
          vm.selectedCat.forEach(function(element) {
            vm.SupplierData.Supplier_Category_IDs.push(element.Category_ID);
          });
          //product Categories
          vm.SupplierData.Supplier_ProductCategory_Code = [];
          vm.selectedProductCategories.forEach(function(element) {
            vm.SupplierData.Supplier_ProductCategory_Code.push(
              element.ProductCategory_Code
            );
          });
           //selling Areas
           vm.SupplierData.Supplier_SellingAreaCodes = [];
           vm.SupplierData.Supplier_SellingAreaNames = [];
           vm.selectedSellingAreas.forEach(function(element){
               vm.SupplierData.Supplier_SellingAreaCodes.push(element.SellingArea_Code) ;
               vm.SupplierData.Supplier_SellingAreaNames.push(element.SellingArea_Name) ;
           })

          vm.SupplierData.Supplier_Certificates = [];
          vm.selectedCertificates.forEach(function(element) {
            vm.SupplierData.Supplier_Certificates.push(element);
          });
          vm.SupplierData.Supplier_Agencies = [];
          vm.selectedAgencies.forEach(function(element) {
            vm.SupplierData.Supplier_Agencies.push(element);
          });
          vm.SupplierData["User_Code"] = vm.logedUser.id;
          $http({
            method: "POST",
            url: "http://35.246.143.96:3111/EditSupplier",//35.246.143.96:3111
            data: vm.SupplierData
          }).then(function(data) {
            showAddToast("Supplier Edited successfully", $mdToast);
            vm.isLoading = false;
            $mdDialog.hide();
          });
        }
      }
    };
  }
})();
