(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddCountryController', AddCountryController);

    /* @ngInject */
    function AddCountryController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddCountry',
                data :JSON.stringify(vm.Country)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Category added successfully',$mdToast);
                    vm.Country= {};
                    vm.addCountryForm.$setPristine();
                    vm.addCountryForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();