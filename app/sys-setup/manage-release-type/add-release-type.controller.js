(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddReleaseTypeController', AddReleaseTypeController);

    /* @ngInject */
    function AddReleaseTypeController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddReleaseType',
                data :JSON.stringify(vm.ReleaseType)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Custom Release Type added successfully',$mdToast);
                    vm.Category= {};
                    vm.addCustomReleaseTypeForm.$setPristine();
                    vm.addCustomReleaseTypeForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();