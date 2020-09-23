(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddProductCategoryController', AddProductCategoryController);

    /* @ngInject */
    function AddProductCategoryController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddProductCategory',
                data :JSON.stringify(vm.ProductCategory)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Product Category added successfully',$mdToast);
                    vm.ProductCategory= {};
                    vm.addProductCategoryForm.$setPristine();
                    vm.addProductCategoryForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();