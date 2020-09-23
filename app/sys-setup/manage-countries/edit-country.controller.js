(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditCountryController', EditCountryController);

    /* @ngInject */
    function EditCountryController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.Country = itemToEdit;
        if(itemToEdit.Country_IsActive == 1){
            vm.Country_IsActive = true
        }
        else{
            vm.Country_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.Country_IsActive == true){
                vm.Country.Country_IsActive = 1;
            }
            else{
                vm.Country.Country_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditCountry',
                data :JSON.stringify(vm.Country)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Country Saved successfully',$mdToast);
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