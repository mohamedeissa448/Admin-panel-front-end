(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditTemperatureUnitController', EditTemperatureUnitController);

    /* @ngInject */
    function EditTemperatureUnitController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.TemperatureUnit = {};
        vm.TemperatureUnit.TemperatureUnit_Code = itemToEdit.TemperatureUnit_Code;
        vm.TemperatureUnit.TemperatureUnit_Name = itemToEdit.TemperatureUnit_Name;
        vm.TemperatureUnit.TemperatureUnit_Description = itemToEdit.TemperatureUnit_Description;
        if(itemToEdit.TemperatureUnit_IsActive == 1){
            vm.TemperatureUnit_IsActive = true
        }
        else{
            vm.TemperatureUnit_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.TemperatureUnit_IsActive == true){
                vm.TemperatureUnit.TemperatureUnit_IsActive = 1;
            }
            else{
                vm.TemperatureUnit.TemperatureUnit_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditTemperatureUnit',
                data :JSON.stringify(vm.TemperatureUnit)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Temperature Unit edited successfully',$mdToast);
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