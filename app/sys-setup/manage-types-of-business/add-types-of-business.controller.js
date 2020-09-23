(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddTypesOfBusinessController', AddTypesOfBusinessController);

    /* @ngInject */
    function AddTypesOfBusinessController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/addTypeOfBusiness',
                data :JSON.stringify(vm.TypesOfBusiness)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Type Of Business added successfully',$mdToast);
                    vm.TypesOfBusiness= {};
                    vm.addTypesOfBusinessForm.$setPristine();
                    vm.addTypesOfBusinessForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();