(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditCategoryController', EditCategoryController);

    /* @ngInject */
    function EditCategoryController($mdToast,$mdDialog, triLoaderService,$http,CategoryID, CategoryName, CategoryDesc, CategoryStatus) {
        var vm = this;
        vm.Category = {};
        vm.Category.Category_ID = CategoryID;
        vm.Category.Category_Name = CategoryName;
        vm.Category.Category_Description = CategoryDesc;
        if(CategoryStatus == 1){
            vm.CategoryStatus = true
        }
        else{
            vm.CategoryStatus = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.CategoryStatus == true){
                vm.Category.Category_IsActive = 1;
            }
            else{
                vm.Category.Category_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditCategory',
                data :JSON.stringify(vm.Category)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Category edited successfully',$mdToast);
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