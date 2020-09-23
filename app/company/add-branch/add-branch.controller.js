(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('AddBranchController', AddBranchController);

    /* @ngInject */
    function AddBranchController($mdToast,$mdDialog,UserService, triLoaderService,$http) {
        var vm = this; 
        $http.get("http://localhost:4000/getTypesOfBusiness").then(function (response) {			   
            vm.typesOfBusiness = response.data;
        });
        $http.get("http://localhost:4000/companies/getAll").then(function (response) {			   
            vm.companies = response.data;
        })
        vm.SubmitData=function(form){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/branches/addBranch',
                data :JSON.stringify(vm.Branch)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Branch added successfully',$mdToast);
                    vm.Branch= {};
                    vm.addBranchForm.$setPristine();
                    vm.addBranchForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });
        }
       
    }
})();