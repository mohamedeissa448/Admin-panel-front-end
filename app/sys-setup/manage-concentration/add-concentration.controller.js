(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddConcentrationController', AddConcentrationController);

    /* @ngInject */
    function AddConcentrationController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddConcentration',
                data :JSON.stringify(vm.Concentration)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Concentration added successfully',$mdToast);
                    vm.Concentration= {};
                    vm.addConcentrationForm.$setPristine();
                    vm.addConcentrationForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();