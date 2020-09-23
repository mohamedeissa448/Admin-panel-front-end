(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddPaymentMethodController', AddPaymentMethodController);

    /* @ngInject */
    function AddPaymentMethodController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddPaymentMethod',
                data :JSON.stringify(vm.PaymentMethod)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Payment Method added successfully',$mdToast);
                    vm.PaymentMethod= {};
                    vm.addPaymentMethodForm.$setPristine();
                    vm.addPaymentMethodForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();