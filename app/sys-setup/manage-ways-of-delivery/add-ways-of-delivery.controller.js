(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddWaysOfDeliveryController', AddWaysOfDeliveryController);

    /* @ngInject */
    function AddWaysOfDeliveryController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddWaysOfDelivery',
                data :JSON.stringify(vm.WaysOfDelivery)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Ways Of Delivery added successfully',$mdToast);
                    vm.WaysOfDelivery= {};
                    vm.addWaysOfDeliveryForm.$setPristine();
                    vm.addWaysOfDeliveryForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();