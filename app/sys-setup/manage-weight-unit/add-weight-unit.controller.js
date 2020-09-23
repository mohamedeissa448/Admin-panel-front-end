(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddWeightUnitController', AddWeightUnitController);

    /* @ngInject */
    function AddWeightUnitController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddWeight',
                data :JSON.stringify(vm.WeightUnit)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Weight Unit added successfully',$mdToast);
                    vm.WeightUnit= {};
                    vm.addWeightUnitForm.$setPristine();
                    vm.addWeightUnitForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();