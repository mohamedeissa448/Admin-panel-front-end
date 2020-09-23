(function() {
    'use strict';

    angular
        .module('manageproduct')
        .controller('AddProductController', AddProductController);
        
    /* @ngInject */
    function AddProductController($scope,$mdToast,$mdDialog,UserService, triLoaderService,$http, $q) {
        var vm = this;
        vm.isLoading = true;
        vm.autoSuffic = true;
        vm.selectedCertificates = [];
        vm.selectedStorageConditions = [];
        vm.logedUser = UserService.getCurrentUser();
        ///
        vm.productDocuments = [];
        vm.filesToUpload=[];
        /*angular.forEach(ItemToEdit.CustomerOrder_Products, function(element, key) {
          console.log("e", element, "key", key);
          vm.productDocuments.push({
            Order_Product_Name: element.Order_Product_Name,
            Order_Product: element.Order_Product,
          });
        });*/
        vm.AddproductDocument = function() {
            console.log("$scope.files",$scope.files)
            vm.filesToUpload.push($scope.files[0])
            var document = {
                Document_Name         :$scope.files[0].name,
               Document_Description   :vm.Document_Description,
               Document_End_Date      :vm.Document_End_Date
           
            };
            vm.productDocuments.push(document);
            console.log("document",document);
            console.log("vm.filesToUpload",vm.filesToUpload);
            //clear form data
            vm.Document_Description="";
            vm.Document_End_Date=""
        };
  
    
        vm.DeleteRequest = function(document) {
          console.log("document", document);
          vm.productDocuments.splice(vm.productDocuments.indexOf(document), 1);
          console.log("after delete productDocuments", vm.productDocuments);
        };
      
        $http.get("http://35.246.143.96:3111/getForm").then(function (response) {			   
            vm.forms = response.data;
        }).then(function(){
            $http.get("http://35.246.143.96:3111/getReleaseType").then(function (response) {			   
                vm.ReleaseTypes = response.data;
        }).then(function(){
            $http.get("http://35.246.143.96:3111/getClasses").then(function (response) {			   
                vm.classes = response.data;
        }).then(function(){
            $http.get("http://35.246.143.96:3111/getCountries").then(function (response) {			   
                vm.countries = response.data;
        }).then(function(){
            $http.get("http://localhost:4000/getProductUnits").then(function (response) {			   
                vm.productUnits = response.data;
        }).then(function(){
            $http.get("http://localhost:4000/getOriginVariants").then(function (response) {			   
                vm.productOriginVariants = response.data;
        }).then(function(){
            $http.get("http://35.246.143.96:3111/getPacking").then(function (response) {			   
                vm.packings = response.data;
        }).then(function () {			   
            $http.get("http://35.246.143.96:3111/getStorageType").then(function (response) {			   
                vm.storages = response.data;
        }).then(function () {			   
            $http.get("http://35.246.143.96:3111/getCertificate").then(function (response) {			   
                vm.Certificates = response.data;
        }).then(function () {			   
            $http.get("http://35.246.143.96:3111/getWeight").then(function (response) {			   
                vm.Weights = response.data;
        }).then(function () {			   
            $http.get("http://35.246.143.96:3111/getTemperatureUnit").then(function (response) {			   
                vm.TemperatureUnits = response.data;
        }).then(function () {			   
            $http.get("http://35.246.143.96:3111/getConcentration").then(function (response) {			   
                vm.Concentrations = response.data;
        }).then(function () {			   
            $http.get("http://35.246.143.96:3111/getManufacturer").then(function (response) {			   
                vm.Manufacturers = response.data;
        }).then(function () {			   
            getProductCategories();
        });});});});});});});});});})})})})
        function getProductCategories(){
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
        }
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
        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }
        vm.manufacturerChanged = function(item){
            if(item)
                vm.selectedManufacturerText = item.Supplier_Name;
            else
                vm.selectedManufacturerText = '';
            vm.updateProductSuffix();
        }
        vm.updateProductSuffix = function(){
            if(vm.autoSuffic){
                
                var concentrationDash =''; var ManufacturerDash = '';
                var Manufacturer = vm.selectedManufacturerText;
                var Concentration
                if(!vm.ProductData.Product_Concentration_Value)
                    Concentration = null; 
                else
                    Concentration = vm.ProductData.Product_Concentration_Value; 
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
                vm.ProductData.Product_Suffix = Concentration + concentrationDash + Manufacturer + ManufacturerDash + country;
            }
        }
        
        vm.interval = setInterval(function(){
            vm.StartProcessData(false);
        }, 120000);

        vm.StartProcessData = function(isFinalSave){
            if(isFinalSave){
                triLoaderService.setLoaderActive(true);
            }
            if(vm.AddProductForm.$valid){
                vm.setCommonData(isFinalSave);
                if(!vm.ProductID){
                    vm.setSaveIntialData();
                    vm.GeneralSave(true, isFinalSave);
                    console.log('data should be intial Save');
                }
                else{
                    vm.setEditData();
                    vm.GeneralSave(false, isFinalSave);
                    console.log('data should be Edit Save');
                }
            }
            else{
                console.log('Form Not Valid'); 
                triLoaderService.setLoaderActive(false);
            }
        }

        vm.setCommonData = function(isFinalSave){
            if(!isFinalSave){
                vm.ProductNameCopy = vm.Product_Name;
                vm.ProductData.Product_Name = vm.ProductNameCopy + ' (auto save)';
            }
            else{
                vm.ProductData.Product_Name = vm.Product_Name;
            }
            vm.ProductData.Product_Category_ID = [];
            vm.selectedCat.forEach(function(element){vm.ProductData.Product_Category_ID.push(element.Category_ID) })
           //product categories
           vm.ProductData.Product_ProductCategory_Code = [];
           vm.selectedProductCategories.forEach(function(element){vm.ProductData.Product_ProductCategory_Code.push(element.ProductCategory_Code) })
          //selling Areas
           vm.ProductData.Product_SellingAreaCodes = [];
           vm.ProductData.Product_SellingAreaNames = [];
           vm.selectedSellingAreas.forEach(function(element){
               vm.ProductData.Product_SellingAreaCodes.push(element.SellingArea_Code) ;
               vm.ProductData.Product_SellingAreaNames.push(element.SellingArea_Name) ;
           })
            vm.ProductData.Product_Certification = [];
            vm.selectedProductCertificates.forEach(function(element){vm.ProductData.Product_Certification.push(element.Certificate_Code)});
            vm.ProductData.Product_StorageType_Code = [];
            vm.selectedStorageConditions.forEach(function(element){vm.ProductData.Product_StorageType_Code.push(element.StorageType_Code)});
            
        }
        vm.setSaveIntialData = function(){
            vm.URLToPost = 'AddProduct';
        }
        vm.setEditData = function(){
            vm.ProductData.Product_IsActive = 1;
            vm.ProductData.Product_Code = vm.ProductID;
            vm.URLToPost = 'EditProduct';
        }
        
        $scope.$on('$destroy', function() {
            clearInterval(vm.interval);
        });
        vm.GeneralSave = function(isIntial, isFinalSave){
            vm.ProductData.Product_Manufacturer_Code = vm.selectedProduct_Manufacturer.Supplier_Code;
            vm.ProductData.User_Code = vm.logedUser.id;
            $http({
                method:"POST",
                url:"http://localhost:4000/" + vm.URLToPost,
                data : vm.ProductData
            }).then(function(data){
                if(data.data.message == true){
                    //showAddToast('Product added successfully',$mdToast);
                    if(isIntial){
                        vm.ProductID = data.data.data.Product_Code;
                    }
                    if(isFinalSave){
                        showAddToast('Product added successfully',$mdToast);
                        $mdDialog.hide();
                        triLoaderService.setLoaderActive(false);
                    }
                    else{
                        showAutoSaveToast('Data Auto Saved ',$mdToast);
                        //clearInterval(vm.interval);
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
        // vm.AutoEditProduct = function(){
            
        //     $http({
        //         method:"POST",
        //         url:"http://35.246.143.96:3111/EditProduct",
        //         data : vm.ProductData
        //     }).then(function(data){
        //         showAddToast('Product saved successfully',$mdToast);
        //         $mdDialog.hide();
        //         triLoaderService.setLoaderActive(false);
        //     });
        // }

        vm.SubmitData=function(form){
            vm.StartProcessData(true);
            // vm.InitialSave();
            // triLoaderService.setLoaderActive(true);
            // vm.ProductData.Product_Category_ID = [];
            // vm.selectedCat.forEach(function(element){vm.ProductData.Product_Category_ID.push(element.Category_ID) })
            // vm.ProductData.Product_ProductCategory_Code = [];
            // vm.selectedProductCategories.forEach(function(element){vm.ProductData.Product_ProductCategory_Code.push(element.ProductCategory_Code) })
            // vm.ProductData.Product_Certification = [];
            // vm.selectedProductCertificates.forEach(function(element){vm.ProductData.Product_Certification.push(element.Certificate_Code)});
            // vm.ProductData.Product_StorageType_Code = [];
            // if(vm.selectedStorageConditions)
            //     vm.selectedStorageConditions.forEach(function(element){vm.ProductData.Product_StorageType_Code.push(element.StorageType_Code)});
            // $http({
            //     method:"POST",
            //     url:"http://35.246.143.96:3111/AddProduct",
            //     data : vm.ProductData
            // }).then(function(data){
            //     if(data.data.message == true){
            //         showAddToast('Product added successfully',$mdToast);
            //         vm.ProductID = data.data.data.Product_Code;
            //         console.log(vm.ProductID);
            //         //$mdDialog.hide();
            //     }
            //     else{
            //         showAddErrorToast('Erorr, please try againn',$mdToast);
            //     }
                
            //     triLoaderService.setLoaderActive(false);
            // });
        }
        vm.CloseForm = function(){
            if(vm.AddProductForm.$dirty){
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
    }
})();