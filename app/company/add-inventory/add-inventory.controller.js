(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('AddInventoryController', AddInventoryController);

    /* @ngInject */
    function AddInventoryController($mdToast,$mdDialog,UserService, triLoaderService,$http) {
        var vm = this; 

        $http.get("http://localhost:4000/companies/getAll").then(function (response) {			   
            vm.companies = response.data;
        })
        $http.get("http://localhost:4000/branches/getAll").then(function (response) {			   
            vm.branches = response.data;
        })
        vm.SubmitData=function(form){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/inventories/addInventory',
                data :JSON.stringify(vm.Inventory)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Inventory added successfully',$mdToast);
                    vm.Inventory= {};
                    vm.addInventoryForm.$setPristine();
                    vm.addInventoryForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });
        }
       
    }
})();