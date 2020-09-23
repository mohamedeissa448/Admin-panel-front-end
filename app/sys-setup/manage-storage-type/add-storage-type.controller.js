(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddStorageTypeController', AddStorageTypeController);

    /* @ngInject */
    function AddStorageTypeController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddStorageType',
                data :JSON.stringify(vm.StorageType)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Category added successfully',$mdToast);
                    vm.StorageType= {};
                    vm.addStorageTypeForm.$setPristine();
                    vm.addStorageTypeForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();