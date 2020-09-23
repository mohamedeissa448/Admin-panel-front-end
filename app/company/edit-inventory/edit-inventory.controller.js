(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('EditInventoryController', EditInventoryController);

    /* @ngInject */
    function EditInventoryController($mdToast,$mdDialog, triLoaderService,$http,Inventory_Code, Inventory_Name, Inventory_Location, Inventory_Related_To_Company,Inventory_Related_To_Branch,Inventory_Keeper) {
        var vm = this;

        $http.get("http://localhost:4000/companies/getAll").then(function (response) {			   
            vm.companies = response.data;
        });
        $http.get("http://localhost:4000/branches/getAll").then(function (response) {			   
            vm.branches = response.data;
        });
        vm.Inventory = {};
        vm.Inventory.Inventory_Code = Inventory_Code ;
        vm.Inventory.Inventory_Name = Inventory_Name ;
        vm.Inventory.Inventory_Location = Inventory_Location ;
        vm.Inventory.Inventory_Related_To_Company = Inventory_Related_To_Company._id ;
        vm.Inventory.Inventory_Related_To_Branch = Inventory_Related_To_Branch._id ;
        vm.Inventory.Inventory_Keeper = Inventory_Keeper;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
         
            $http({
                method:'POST',
                url:'http://localhost:4000/inventories/editInventoryByCode',
                data :JSON.stringify(vm.Inventory)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Inventory edited successfully',$mdToast);
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