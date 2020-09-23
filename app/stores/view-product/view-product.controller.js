(function() {
    'use strict';

    angular
        .module('manageproduct')
        .controller('ViewProductInternalController', ViewProductInternalController);
        
    /* @ngInject */
    function ViewProductInternalController($scope,$mdToast,$mdDialog, triLoaderService ,$http, ProductToView) {
        var vm = this;
        vm.isLoading = true;
        vm.autoSuffic = false;
        vm.prodct_code = {};
        vm.prodct_code.Product_Code = ProductToView.Product_Code;
        $http({
            method:"Post",
            url:"http://35.246.143.96:3111/getAllProduct",
            data :vm.prodct_code
        }).then(function(data){
            vm.ProductData = data.data[0];
            // console.log(vm.ProductData)
            if(vm.ProductData.Product_IsActive == 1){
                vm.Product_IsActive = true
            }
            else{
                vm.Product_IsActive = false
            }
            vm.selectedCertificates = vm.ProductData.Product_Certification;
        }).then(function(){
            $http.get("http://35.246.143.96:3111/getForm").then(function (response) {			   
                vm.forms = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getReleaseType").then(function (response) {			   
                vm.ReleaseTypes = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getClasses").then(function (response) {			   
                vm.classes = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getCertificate").then(function (response) {			   
                vm.Certificates = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getCountries").then(function (response) {			   
                vm.countries = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getPacking").then(function (response) {			   
                vm.packings = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getStorageType").then(function (response) {			   
                vm.storages = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getWeight").then(function (response) {			   
                vm.Weights = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getConcentration").then(function (response) {			   
                vm.Concentrations = response.data;
            }).then(function(){
            $http.get("http://35.246.143.96:3111/getTemperatureUnit").then(function (response) {			   
                vm.TemperatureUnits = response.data;
            }).then(function () {			   
                $http.get("http://35.246.143.96:3111/getManufacturer").then(function (response) {			   
                    vm.Manufacturers = response.data;
            }).then(function () {			   
                getProductCategories();
            });});});});});});});});});})});
        },function(error){
            console.log(error);
        });
        // vm.ProductData = ProductToView;
        // console.log(vm.ProductData);
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
        

        function getProductCategories(){
            $http.get("http://35.246.143.96:3111/getCategories").then(function (response) {
                vm.selectedCatItem = null;
                vm.searchCatText = null;
                vm.queryCats = queryCats;
                vm.Categories = response.data;
                if(vm.ProductData.Category){
                    vm.selectedCat = vm.ProductData.Category;
                }
                else{
                    vm.selectedCat =[];
                }
                


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
                
            }).then(function () {
            $http.get("http://35.246.143.96:3111/getProductCategory").then(function (response) {			   
                vm.selectedProdCatItem = null;
                vm.selectedProductCertiItem = null;
                vm.selectedStorageCondItem = null;
                vm.searchProdCatText = null;
                vm.searchProdCertiText = null
                vm.searchStorageCondText = null;
                vm.queryProdCats = queryProdCats;
                vm.queryStorageConds = queryStorageConds;
                vm.queryProdCertis = queryProdCertis;
                vm.ProductCategories = response.data;
                vm.isLoading = false;
                if(vm.ProductData.productcategory){
                    vm.selectedProductCategories = vm.ProductData.productcategory;
                }
                else{
                    vm.selectedProductCategories =[];
                }
                if(vm.ProductData.productstrage){
                    vm.selectedStorageConditions = vm.ProductData.productstrage;
                }
                else{
                    vm.selectedStorageConditions = [];
                }
                if(vm.ProductData.certification){
                    vm.selectedProductCertificates = vm.ProductData.certification;
                }
                else{
                    vm.selectedProductCertificates = [];
                }
                
                vm.transformChip = transformChip;   
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
            });});
        }
        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }

        vm.interval = setInterval(function(){
            vm.StartProcessData(false);
        }, 120000);
        $scope.$on('$destroy', function() {
            clearInterval(vm.interval);
        });
        vm.StartProcessData = function(isFinalSave){
            if(isFinalSave){
                triLoaderService.setLoaderActive(true);
            }
            if(vm.EditProductForm.$valid){
                vm.ProductData.Product_Category_ID = [];
                vm.selectedCat.forEach(function(element){vm.ProductData.Product_Category_ID.push(element.Category_ID) })
                vm.ProductData.Product_ProductCategory_Code = [];
                vm.selectedProductCategories.forEach(function(element){vm.ProductData.Product_ProductCategory_Code.push(element.ProductCategory_Code) })
                vm.ProductData.Product_Certification = [];
                vm.selectedProductCertificates.forEach(function(element){vm.ProductData.Product_Certification.push(element.Certificate_Code)});
                vm.ProductData.Product_StorageType_Code = [];
                vm.selectedStorageConditions.forEach(function(element){vm.ProductData.Product_StorageType_Code.push(element.StorageType_Code)});
                if(vm.Product_IsActive == true){
                    vm.ProductData.Product_IsActive = 1;
                }
                else{
                    vm.ProductData.Product_IsActive = 0;
                }
                $http({
                    method:"POST",
                    url:"http://35.246.143.96:3111/EditProduct",
                    data : vm.ProductData
                }).then(function(data){
                    if(data.data.message == true){
                        if(isFinalSave){
                            showAddToast('Product added successfully',$mdToast);
                            $mdDialog.hide();
                            triLoaderService.setLoaderActive(false);
                        }
                        else{
                            showAutoSaveToast('Data Auto Saved ',$mdToast);
                        }
                    }
                    else{
                        if(isFinalSave){
                            showAddErrorToast('Erorr, please try again',$mdToast);
                            triLoaderService.setLoaderActive(false);
                        }
                        else{
                            showAutoSaveErrorToast('Auto Save Faild',$mdToast);
                        }
                    }
                });
            }
            else{
                console.log('Form Not Valid'); 
                triLoaderService.setLoaderActive(false);
            }
        }

        vm.SubmitData=function(form){
            vm.StartProcessData(true)
        }
        vm.updateProductSuffix = function(){
            if(vm.autoSuffic){
                var concentrationDash =''; var ManufacturerDash = '';
                var Manufacturer = vm.ProductData.Product_Manufacturer;
                var Concentration = vm.ProductData.Product_Concentration_Value;
                var country = '';
                if(vm.ProductData.Product_Origin_Country_Code){
                    var countryItem = vm.countries.find(function(countryItem) {
                        return countryItem.Country_Code == vm.ProductData.Product_Origin_Country_Code; 
                    });
                    country = countryItem.Country_Name;
                }
                if(Concentration && (Manufacturer || country)){
                    concentrationDash = ' - ';
                }
                else if (!Concentration) {
                    Concentration = '';
                }
                if(Manufacturer && country){
                    ManufacturerDash = ' - '; 
                }
                else if(!Manufacturer){
                    Manufacturer ='';
                }
                console.log( Concentration + concentrationDash + Manufacturer + ManufacturerDash + country)
                vm.ProductData.Product_Suffix = Concentration + concentrationDash + Manufacturer + ManufacturerDash + country;
            }
        }
        vm.CloseForm = function(){
            if(vm.EditProductForm.$dirty){
                ConfirmCloseDialog($mdDialog);
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

    }
})();