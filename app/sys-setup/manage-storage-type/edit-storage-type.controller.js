(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditStorageTypeController', EditStorageTypeController);

    /* @ngInject */
    function EditStorageTypeController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.StorageType = itemToEdit;
        if(vm.StorageType.StorageType_IsActive == 1){
            vm.StorageTypeStatus = true
        }
        else{
            vm.StorageTypeStatus = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.StorageTypeStatus == true){
                vm.StorageType.StorageType_IsActive = 1;
            }
            else{
                vm.StorageType.StorageType_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditStorageType',
                data :JSON.stringify(vm.StorageType)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Storage Type edited successfully',$mdToast);
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