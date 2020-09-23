(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditPaymentMethodController', EditPaymentMethodController);

    /* @ngInject */
    function EditPaymentMethodController($mdToast,$mdDialog, triLoaderService,$http,PaymentMethod_Code, PaymentMethod_Name, PaymentMethod_Description, PaymentMethod_IsActive) {
        var vm = this;
        vm.PaymentMethod = {};
        vm.PaymentMethod.PaymentMethod_Code = PaymentMethod_Code;
        vm.PaymentMethod.PaymentMethod_Name = PaymentMethod_Name;
        vm.PaymentMethod.PaymentMethod_Description = PaymentMethod_Description;
        if(PaymentMethod_IsActive == 1){
            vm.PaymentMethod_IsActive = true
        }
        else{
            vm.PaymentMethod_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.PaymentMethod_IsActive == true){
                vm.PaymentMethod.PaymentMethod_IsActive = 1;
            }
            else{
                vm.PaymentMethod.PaymentMethod_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditPaymentMethod',
                data :JSON.stringify(vm.PaymentMethod)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('PaymentMethod edited successfully',$mdToast);
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