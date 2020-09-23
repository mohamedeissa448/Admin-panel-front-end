(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddTemperatureUnitController', AddTemperatureUnitController);

    /* @ngInject */
    function AddTemperatureUnitController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddTemperatureUnit',
                data :JSON.stringify(vm.TemperatureUnit)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Temperature Unit added successfully',$mdToast);
                    vm.TemperatureUnit= {};
                    vm.addTemperatureUnitForm.$setPristine();
                    vm.addTemperatureUnitForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();