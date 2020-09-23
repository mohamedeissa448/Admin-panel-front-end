(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditWaysOfDeliveryController', EditWaysOfDeliveryController);

    /* @ngInject */
    function EditWaysOfDeliveryController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.WaysOfDelivery = itemToEdit;
        if(vm.WaysOfDelivery.WayOfDelivary_IsActive == 1){
            vm.WaysOfDeliveryStatus = true
        }
        else{
            vm.WaysOfDeliveryStatus = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.WaysOfDeliveryStatus == true){
                vm.WaysOfDelivery.WayOfDelivary_IsActive = 1;
            }
            else{
                vm.WaysOfDelivery.WayOfDelivary_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditWaysOfDelivery',
                data :JSON.stringify(vm.WaysOfDelivery)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Ways Of Delivery edited successfully',$mdToast);
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