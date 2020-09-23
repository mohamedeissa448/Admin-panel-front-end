(function() {
    'use strict';

    angular
        .module('managesuppliers')
        .controller('AddSupplierController', AddSupplierController);

    /* @ngInject */
    function AddSupplierController($mdToast,$mdDialog,UserService, triLoaderService,$http) {
        var vm = this;
        vm.SupplierData ={};
        vm.selectedAgencies = [];
        vm.selectedCertificates = [];
        vm.logedUser = UserService.getCurrentUser();
        $http.get("http://35.246.143.96:3111/getCountries").then(function (response) {			   
            vm.countries = response.data;
        });
        $http.get("http://35.246.143.96:3111/getClasses").then(function (response) {			   
            vm.classes = response.data;
        });
        $http.get("http://35.246.143.96:3111/getCategories").then(function (response) {			   
            vm.selectedCatItem = null;
            vm.searchCatText = null;
            vm.queryCats = queryCats;
            vm.Categories = response.data;
            vm.selectedCat = [];
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
        
        $http.get("http://35.246.143.96:3111/getSupplierTypes").then(function (response) {			   
            vm.selectedSupplTypeItem = null;
            vm.searchSupplTypeText = null;
            vm.querySupplTypes = querySupplTypes;
            vm.SupplierTypes = response.data;
            vm.selectedSupplierTypes = [];
            vm.transformChip = transformChip;   
            function querySupplTypes($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.SupplierTypes.filter(function(suppliertypes) {
                    var lowercaseName = angular.lowercase(suppliertypes.SupplierType_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return suppliertypes;
                    }
                });
            }
            
        });

        $http.get("http://35.246.143.96:3111/getPaymentMethods").then(function (response) {			   
            vm.selectedPayMethItem = null;
            vm.searchPayMethIText = null;
            vm.queryPayMeths = queryPayMeths;
            vm.PaymentMethods = response.data;
            vm.selectedPaymentMethods = [];
            vm.transformChip = transformChip;   
            function queryPayMeths($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.PaymentMethods.filter(function(paymentmethods) {
                    var lowercaseName = angular.lowercase(paymentmethods.PaymentMethod_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return paymentmethods;
                    }
                });
            }
            
        });

        $http.get("http://35.246.143.96:3111/getWaysOfDelivery").then(function (response) {			   
            vm.selectedWayOfDelItem = null;
            vm.searchWayOfDelText = null;
            vm.queryWayOfDels = queryWayOfDels;
            vm.WaysOfDelivery = response.data;
            vm.selectedWaysOfDelivery = [];
            vm.transformChip = transformChip;   
            function queryWayOfDels($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.WaysOfDelivery.filter(function(waysofdelivery) {
                    var lowercaseName = angular.lowercase(waysofdelivery.WayOfDelivary_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return waysofdelivery;
                    }
                });
            }
            
        })//start product categories
        .then(function() {
            $http.get("http://35.246.143.96:3111/getProductCategory").then(function (response) {			   
                vm.selectedProdCatItem = null;
                vm.selectedProductCertiItem = null;
                vm.selectedStorageCondItem = null;
                vm.searchProdCatText = null;
                vm.searchProdCertiText = null
                vm.searchStorageCondText = null;
                vm.queryProdCats = queryProdCats;
                vm.queryProdCertis = queryProdCertis;
                vm.queryStorageConds = queryStorageConds;
                vm.ProductCategories = response.data;
                vm.selectedProductCategories = [];
                vm.selectedProductCertificates = [];
                vm.transformChip = transformChip;  
                vm.isLoading = false; 
                function queryProdCats($query) {
                    var lowercaseQuery = angular.lowercase($query);
                    return vm.ProductCategories.filter(function(productcategories) {
                        var lowercaseName = angular.lowercase(productcategories.ProductCategory_Name);
                        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                            return productcategories;
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

        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }
        vm.CloseForm = function(){
            if(vm.AddSupplierForm.$dirty){
                ConfirmCloseDialog();
            }
            else{
                $mdDialog.hide();
            }
        }
        function ConfirmCloseDialog(){
            var Result;
            $mdDialog.show({
                multiple: true,skipHide: true,
                controllerAs:'confirmDialog',
                bindToController: true,
                controller: function($mdDialog){
                    var vmc = this;
                    vmc.closeform = function closeform(){
                        $mdDialog.hide();
                        Result =  true;
                    }
                    vmc.hide = function hide(){
                        $mdDialog.hide();
                        Result = false;
                    }
                  }
                ,template: GetConfirmCloseTemplate()
            }).then(function() {
                if(Result){
                    $mdDialog.hide();
                }
            });
        }
        vm.SubmitData = function(){
            if(vm.SupplierData.Supplier_IsManufacturer == false && vm.SupplierData.Supplier_IsSupplier == false){
                showAddErrorToast('You Have to Choose Organization Type, (is Supplier) or (is Manufacturer) or Both ',$mdToast);
            }else if(vm.selectedCat == undefined || vm.selectedCat.length == 0 ){
                showAddErrorToast('You Have to Choose Category ',$mdToast);
            }else if(vm.SupplierData.Supplier_Class_Code == undefined ){
                showAddErrorToast('You Have to Choose Class ',$mdToast);
            }else{
                triLoaderService.setLoaderActive(true);
                vm.SupplierMailTocheck = {};
                vm.SupplierMailTocheck.Supplier_Email= vm.SupplierData.Supplier_Email;

                $http({
                    method:"POST",
                    url:"http://35.246.143.96:3111/checkSupplierByEmail",
                    data : vm.SupplierMailTocheck
                }).then(function(data){
                    if(data.data.length>0){
                        showAddErrorToast('The email address you have entered is already registered',$mdToast);
                        triLoaderService.setLoaderActive(false);
                    }
                    else{
                        AddSupplier()
                    }
                    
                })
                function AddSupplier(){
                    vm.SupplierData.Supplier_PaymentMethod_Codes =[];
                    vm.selectedPaymentMethods.forEach(function(element) {vm.SupplierData.Supplier_PaymentMethod_Codes.push(element.PaymentMethod_Code)});
                    vm.SupplierData.Supplier_WayOfDelivery_Codes =[];
                    vm.selectedWaysOfDelivery.forEach(function(element){vm.SupplierData.Supplier_WayOfDelivery_Codes.push(element.WayOfDelivary_Code)});
                    vm.SupplierData.Supplier_SupplierType_Codes = [];
                    vm.selectedSupplierTypes.forEach(function(element){ vm.SupplierData.Supplier_SupplierType_Codes.push(element.SupplierType_Code)})
                    vm.SupplierData.Supplier_Category_IDs = [];
                    vm.selectedCat.forEach(function(element){vm.SupplierData.Supplier_Category_IDs.push(element.Category_ID) })

                    vm.SupplierData.Supplier_Certificates = [];
                    vm.selectedCertificates.forEach(function(element){vm.SupplierData.Supplier_Certificates.push(element)});
                    vm.SupplierData.Supplier_Agencies = [];
                    vm.selectedAgencies.forEach(function(element){vm.SupplierData.Supplier_Agencies.push(element)});
                    vm.SupplierData.User_Code = vm.logedUser.id;
                    //product categories
                    vm.SupplierData.Supplier_ProductCategory_Code = [];
                    vm.selectedProductCategories.forEach(function(element){vm.SupplierData.Supplier_ProductCategory_Code.push(element.ProductCategory_Code) })
                    //selling Areas
                    vm.SupplierData.Supplier_SellingAreaCodes = [];
                    vm.SupplierData.Supplier_SellingAreaNames = [];
                    vm.selectedSellingAreas.forEach(function(element){
                        vm.SupplierData.Supplier_SellingAreaCodes.push(element.SellingArea_Code) ;
                        vm.SupplierData.Supplier_SellingAreaNames.push(element.SellingArea_Name) ;
                    })
                    
                    $http({
                        method:"POST",
                        url:"http://35.246.143.96:3111/AddSupplier",
                        data : vm.SupplierData
                    }).then(function(data){
                        if(!data.data.porceed){
                            if(data.data.message.code == 11000){
                                showAddErrorToast("Duplicate Supplier, Please check supplier's email address",$mdToast);
                                triLoaderService.setLoaderActive(false);
                            }
                            else{
                                showAddErrorToast(data.data.message,$mdToast);
                                triLoaderService.setLoaderActive(false);
                            }
                        }
                        else{
                            showAddToast('Supplier added successfully',$mdToast);
                            $mdDialog.hide();
                            triLoaderService.setLoaderActive(false);
                        }
                        
                    });
                }
            }
        }
    }
})();