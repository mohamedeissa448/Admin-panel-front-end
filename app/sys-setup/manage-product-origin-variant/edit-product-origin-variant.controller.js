(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditOriginVariantController', EditOriginVariantController);

    /* @ngInject */
    function EditOriginVariantController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.OriginVariant = itemToEdit;
        
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/editOriginVariant',
                data :JSON.stringify(vm.OriginVariant)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Product Origin Variant edited successfully',$mdToast);
                    $mdDialog.hide();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };

    }
})();