(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManagePackingController', ManagePackingController);

    /* @ngInject */
    function ManagePackingController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.PackingGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retrivePacking();
        function retrivePacking(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getPacking",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Packingslist = data.data;
            }
            else{
                vm.Packingslist = data.data;
            }
            vm.PackingGrid.jsGrid({
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
                data: vm.Packingslist,
                fields: [
                    { title: "Code", name: "Packing_Code", type: "number", width: 35},
                    { title: "Pack Name", name: "Packing_Name", type: "text", width: 100},
                    { title: "Desc", name: "Packing_Description", type: "text", width: 100},
                    { title: "Active",  name: "Packing_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openCategortToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openCategortToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditPackingController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-packing/edit-packing.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.PackingGrid.innerHTML = "";
                    retrivePacking();
                },
                locals: {
                    Packing_Code: itemToEdit.Packing_Code,
                    Packing_Name: itemToEdit.Packing_Name,
                    Packing_Description: itemToEdit.Packing_Description,
                    Packing_IsActive: itemToEdit.Packing_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddPackingController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-packing/add-packing.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.PackingGrid.innerHTML = "";
                    retrivePacking();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getPackingByName',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Packingslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();