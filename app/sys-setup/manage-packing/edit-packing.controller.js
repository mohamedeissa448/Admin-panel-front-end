(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditPackingController', EditPackingController);

    /* @ngInject */
    function EditPackingController($mdToast,$mdDialog, triLoaderService,$http,Packing_Code, Packing_Name, Packing_Description, Packing_IsActive) {
        var vm = this;
        vm.Packing = {};
        vm.Packing.Packing_Code = Packing_Code;
        vm.Packing.Packing_Name = Packing_Name;
        vm.Packing.Packing_Description = Packing_Description;
        if(Packing_IsActive == 1){
            vm.Packing_IsActive = true
        }
        else{
            vm.Packing_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.Packing_IsActive == true){
                vm.Packing.Packing_IsActive = 1;
            }
            else{
                vm.Packing.Packing_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditPacking',
                data :JSON.stringify(vm.Packing)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Packing edited successfully',$mdToast);
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