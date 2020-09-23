(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddOriginVariantController', AddOriginVariantController);

    /* @ngInject */
    function AddOriginVariantController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/addOriginVariant',
                data :JSON.stringify(vm.OriginVariant)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Origin Variant added successfully',$mdToast);
                    vm.OriginVariant= {};
                    vm.addOriginVariantForm.$setPristine();
                    vm.addOriginVariantForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();