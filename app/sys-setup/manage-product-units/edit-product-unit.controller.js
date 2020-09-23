(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditProductUnitController', EditProductUnitController);

    /* @ngInject */
    function EditProductUnitController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.ProductUnit = itemToEdit;
        
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/editProductUnit',
                data :JSON.stringify(vm.ProductUnit)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Product unit edited successfully',$mdToast);
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