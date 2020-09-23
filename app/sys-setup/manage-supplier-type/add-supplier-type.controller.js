(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddSupplierTypeController', AddSupplierTypeController);

    /* @ngInject */
    function AddSupplierTypeController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddSupplierType',
                data :JSON.stringify(vm.SupplierType)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Supplier Type added successfully',$mdToast);
                    vm.SupplierType= {};
                    vm.addSupplierTypeForm.$setPristine();
                    vm.addSupplierTypeForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();