(function() {
    'use strict';

    angular
        .module('manageuser')
        .controller('EditUserAllowedProductController', EditUserAllowedProductController);

    /* @ngInject */
    function EditUserAllowedProductController($mdToast, $mdDialog,$http,UserToEdit) {
        var vm = this;
        vm.isLoading = true;
        vm.UserData = UserToEdit;
        if(vm.UserData.User_Access_All_Products == 1){
            vm.UserData.User_Access_All_Products = true;
        }
        $http({
            method:'POST',
            url:'http://localhost:4000/getUserAccessProducts',
            data : {User_Code:UserToEdit.User_Code}
        }).then(function(data){			   
            vm.userAllowedProductsData = data.data[0];
            if(vm.userAllowedProductsData.User_Allowed_Products &&  vm.userAllowedProductsData.product){
                vm.selectedProducts = vm.userAllowedProductsData.product;
                // console.log(vm.selectedProducts)
                // console.log(vm.userAllowedProductsData);
            }
            else{
                vm.selectedProducts = [];
            }
                
        }).then(function(){
                $http.get("http://35.246.143.96:3111/getProducts").then(function (response) {			   
                vm.selectedProductItem = null;
                vm.searchProductText = null;
                vm.queryProduct = queryProduct;
                vm.Products = response.data;
                vm.transformChip = transformChip;   
                function queryProduct($query) {
                    var lowercaseQuery = angular.lowercase($query);
                    return vm.Products.filter(function(prod) {
                        var lowercaseName = angular.lowercase(prod.Product_Name);
                        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                            return prod;
                        }
                    });
                }
                vm.isLoading = false;
            })
        });
        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }
        vm.SubmitData = function(){
            vm.productError = false;
            vm.isLoading = true;
            // if(vm.UserData.User_Access_All_Customers == true){
            //     vm.UserData.User_Access_All_Customers = 1;
            // }
            var User_Access_All_Products = 0;
            var selectedProductIDs = [];
            if(vm.UserData.User_Access_All_Products){
                User_Access_All_Products = 1
            }
            else{
                if(vm.selectedProducts.length>0){
                    vm.selectedProducts = removeDuplicates(vm.selectedProducts);
                    vm.selectedProducts.forEach(function(Item,index){
                        selectedProductIDs.push(Item.Product_Code)
                    });
                }
                else{
                    vm.productError = true;
                    vm.isLoading = false;
                    return
                }
                
            }

            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/editUserAccessProducts',
                data : {User_Code:UserToEdit.User_Code, User_Access_All_Products:User_Access_All_Products,User_Allowed_Products : selectedProductIDs}
            }).then(function(data){			   
                console.log(data);
                vm.isLoading = false;
                showAddToast('Allowed Products has changed successfully',$mdToast);
            })
            
        }
        vm.AllowedAllProductChanged = function(){
            vm.selectedProducts = [];
        }
        //getUserAccessCustomers
        vm.ConfirmCloseDialog = function(){
            if(vm.allowedProductForm.$dirty){
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
            else
                $mdDialog.hide();
        }
    }
})();