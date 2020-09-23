(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddCertificateController', AddCertificateController);

    /* @ngInject */
    function AddCertificateController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddCertificate',
                data :JSON.stringify(vm.Certificate)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Certificate added successfully',$mdToast);
                    vm.Certificate= {};
                    vm.addCertificateForm.$setPristine();
                    vm.addCertificateForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();