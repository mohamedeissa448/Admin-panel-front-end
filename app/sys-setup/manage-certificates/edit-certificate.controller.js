(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditCertificateController', EditCertificateController);

    /* @ngInject */
    function EditCertificateController($mdToast,$mdDialog, triLoaderService,$http,Certificate_Code, Certificate_Name, Certificate_Description, Certificate_IsActive) {
        var vm = this;
        vm.Certificate = {};
        vm.Certificate.Certificate_Code = Certificate_Code;
        vm.Certificate.Certificate_Name = Certificate_Name;
        vm.Certificate.Certificate_Description = Certificate_Description;
        if(Certificate_IsActive == 1){
            vm.Certificate_IsActive = true
        }
        else{
            vm.Certificate_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.Certificate_IsActive == true){
                vm.Certificate.Certificate_IsActive = 1;
            }
            else{
                vm.Certificate.Certificate_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditCertificate',
                data :JSON.stringify(vm.Certificate)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Certificate edited successfully',$mdToast);
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