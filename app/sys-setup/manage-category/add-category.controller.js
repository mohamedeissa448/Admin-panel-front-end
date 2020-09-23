(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddCategoryController', AddCategoryController);

    /* @ngInject */
    function AddCategoryController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddCategory',
                data :JSON.stringify(vm.Category)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Category added successfully',$mdToast);
                    vm.Category= {};
                    vm.addCategoryForm.$setPristine();
                    vm.addCategoryForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();