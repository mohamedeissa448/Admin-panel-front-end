(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditSupplierTypeController', EditSupplierTypeController);

    /* @ngInject */
    function EditSupplierTypeController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.SupplierType = itemToEdit;
        if(vm.SupplierType.SupplierType_IsActive == 1){
            vm.SupplierTypeStatus = true
        }
        else{
            vm.SupplierTypeStatus = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.SupplierTypeStatus == true){
                vm.SupplierType.SupplierType_IsActive = 1;
            }
            else{
                vm.SupplierType.SupplierType_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditSupplierType',
                data :JSON.stringify(vm.SupplierType)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Supplier Type edited successfully',$mdToast);
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