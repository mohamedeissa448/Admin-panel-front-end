(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddClassController', AddClassController);

    /* @ngInject */
    function AddClassController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddSupplierClass',
                data :JSON.stringify(vm.Class)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Class added successfully',$mdToast);
                    vm.Class= {};
                    vm.addClassForm.$setPristine();
                    vm.addClassForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();