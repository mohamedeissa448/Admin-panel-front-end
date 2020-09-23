(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditReleaseTypeController', EditReleaseTypeController);

    /* @ngInject */
    function EditReleaseTypeController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.ReleaseType = itemToEdit;
        if(itemToEdit.ReleaseType_IsActive == 1){
            vm.ReleaseTypeStatus = true
        }
        else{
            vm.ReleaseTypeStatus = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.ReleaseTypeStatus == true){
                vm.ReleaseType.ReleaseType_IsActive = 1;
            }
            else{
                vm.ReleaseType.ReleaseType_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditReleaseType',
                data :JSON.stringify(vm.ReleaseType)
            }).then(function(data){
                
                if (data.data.message==true) {
                    showAddToast('Custom Release Type edited successfully',$mdToast);
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