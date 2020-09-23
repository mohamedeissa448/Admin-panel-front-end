(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditConcentrationController', EditConcentrationController);

    /* @ngInject */
    function EditConcentrationController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.Concentration = {};
        vm.Concentration.Concentration_Code = itemToEdit.Concentration_Code;
        vm.Concentration.Concentration_Name = itemToEdit.Concentration_Name;
        vm.Concentration.Concentration_Description = itemToEdit.Concentration_Description;
        if(itemToEdit.Concentration_IsActive == 1){
            vm.Concentration_IsActive = true
        }
        else{
            vm.Concentration_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.Concentration_IsActive == true){
                vm.Concentration.Concentration_IsActive = 1;
            }
            else{
                vm.Concentration.Concentration_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditConcentration',
                data :JSON.stringify(vm.Concentration)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Concentration edited successfully',$mdToast);
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