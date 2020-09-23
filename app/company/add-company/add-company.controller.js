(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('AddCompanyController', AddCompanyController);

    /* @ngInject */
    function AddCompanyController($mdToast,$mdDialog,UserService, triLoaderService,$http) {
        var vm = this;

        vm.SubmitData=function(form){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/companies/addCompany',
                data :JSON.stringify(vm.Company)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Company added successfully',$mdToast);
                    vm.Company= {};
                    vm.addCompanyForm.$setPristine();
                    vm.addCompanyForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });
        }
       
    }
})();