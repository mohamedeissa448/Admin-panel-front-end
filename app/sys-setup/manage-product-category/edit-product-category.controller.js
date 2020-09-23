(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditProductCategoryController', EditProductCategoryController);

    /* @ngInject */
    function EditProductCategoryController($mdToast,$mdDialog, triLoaderService,$http,ProductCategory_Code, ProductCategory_Name, ProductCategory_Description, ProductCategory_IsActive) {
        var vm = this;
        vm.ProductCategory = {};
        vm.ProductCategory.ProductCategory_Code = ProductCategory_Code;
        vm.ProductCategory.ProductCategory_Name = ProductCategory_Name;
        vm.ProductCategory.ProductCategory_Description = ProductCategory_Description;
        if(ProductCategory_IsActive == 1){
            vm.ProductCategoryStatus = true
        }
        else{
            vm.ProductCategoryStatus = false
        }
        vm.SubmitData = function(){
            
            triLoaderService.setLoaderActive(true);
            if( vm.ProductCategoryStatus == true){
                vm.ProductCategory.ProductCategory_IsActive = 1;
            }
            else{
                vm.ProductCategory.ProductCategory_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditProductCategory',
                data :JSON.stringify(vm.ProductCategory)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Product Category edited successfully',$mdToast);
                    $mdDialog.hide();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };

    }
})();