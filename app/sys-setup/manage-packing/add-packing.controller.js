(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddPackingController', AddPackingController);

    /* @ngInject */
    function AddPackingController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddPacking',
                data :JSON.stringify(vm.Packing)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Packing added successfully',$mdToast);
                    vm.Packing= {};
                    vm.addPackingForm.$setPristine();
                    vm.addPackingForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();