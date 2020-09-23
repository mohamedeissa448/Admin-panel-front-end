(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('ManageInventoryController', ManageInventoryController);

    /* @ngInject */
    function ManageInventoryController($mdDialog,$http) {
        var vm = this;
        vm.InventoryGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveInventories();
        function retriveInventories(){
            $http({
                method:"GET",
                url:"http://localhost:4000/inventories/getAll",
                data :{}
            }).then(function(data){
                console.log("data",data)
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Companieslist = data.data;
            }
            else{
                vm.Companieslist = data.data;
            }
            vm.InventoryGrid.jsGrid({
                width: "100%",
                height: "400px",
                autoload: false,
                sorting: true,
                selecting: false,
                paging: true,
                inserting: false,
                editing: false,
                pageIndex: 1,
                pageSize: 20,
                pageButtonCount: 15,
                data: vm.Companieslist,
                fields: [
                    { title: "Company Name", name: "Inventory_Related_To_Company.Company_Name", type: "text", width: 100},
                    { title: "Branch Name", name: "Inventory_Related_To_Branch.Branch_Name", type: "text", width: 100},
                    { title: "Inventory Code", name: "Inventory_Code", type: "number", width: 35},
                    { title: "Name",  name: "Inventory_Name", type: "text", width: 100},
                    { title: "Location", name: "Inventory_Location", type: "text", width: 100},
                    { title: "Keeper", name: "Inventory_Keeper", type: "text", width: 60},
    
                    { title: "Edit",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openInventoryToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function openInventoryToEdit(itemToEdit){
            console.log("itemToEdit",itemToEdit)
            $mdDialog.show({
                controller: 'EditInventoryController',
                controllerAs: 'vm',
                templateUrl: 'app/company/edit-inventory/edit-inventory.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.InventoryGrid.innerHTML = "";
                    retriveInventories();
                },
                locals: {
                    Inventory_Code      : itemToEdit.Inventory_Code,
                    Inventory_Name      : itemToEdit.Inventory_Name,
                    Inventory_Location : itemToEdit.Inventory_Location,
                    Inventory_Related_To_Company   : itemToEdit.Inventory_Related_To_Company,
                    Inventory_Related_To_Branch  : itemToEdit.Inventory_Related_To_Branch,
                    Inventory_Keeper     : itemToEdit.Inventory_Keeper,
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddInventoryController',
                controllerAs: 'vm',
                templateUrl: 'app/company/add-inventory/add-inventory.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.InventoryGrid.innerHTML = "";
                    retriveInventories();
                }
            });
        }
        vm.SubmitSearch= function(){
            if(vm.selectSearchType == 'Inventory_Name'){
                vm.SearchFor.propertySearched = 'Inventory_Name';
            }else if(vm.selectSearchType == 'Inventory_Code'){
                vm.SearchFor.propertySearched = 'Inventory_Code';
            }
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://localhost:4000/inventories/searchInventory',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Companieslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
            
        }
    }
})();