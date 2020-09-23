(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditTypesOfBusinessController', EditTypesOfBusinessController);

    /* @ngInject */
    function EditTypesOfBusinessController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.TypeOfBusiness = itemToEdit;
        
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/editTypeOfBusiness',
                data :JSON.stringify(vm.TypeOfBusiness)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Type Of Business edited successfully',$mdToast);
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