(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddProductUnitController', AddProductUnitController);

    /* @ngInject */
    function AddProductUnitController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/addProductUnit',
                data :JSON.stringify(vm.ProductUnit)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Product Unit added successfully',$mdToast);
                    vm.ProductUnit= {};
                    vm.addProductUnitsForm.$setPristine();
                    vm.addProductUnitsForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();