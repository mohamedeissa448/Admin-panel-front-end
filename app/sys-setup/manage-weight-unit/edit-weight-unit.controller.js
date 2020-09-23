(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditWeightUnitController', EditWeightUnitController);

    /* @ngInject */
    function EditWeightUnitController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.WeightUnit = {};
        vm.WeightUnit.Weight_Code = itemToEdit.Weight_Code;
        vm.WeightUnit.Weight_Name = itemToEdit.Weight_Name;
        vm.WeightUnit.Weight_Description = itemToEdit.Weight_Description;
        if(itemToEdit.Weight_IsActive == 1){
            vm.WeightUnit_IsActive = true
        }
        else{
            vm.WeightUnit_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.WeightUnit_IsActive == true){
                vm.WeightUnit.Weight_IsActive = 1;
            }
            else{
                vm.WeightUnit.Weight_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditWeight',
                data :JSON.stringify(vm.WeightUnit)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Weight Unit edited successfully',$mdToast);
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