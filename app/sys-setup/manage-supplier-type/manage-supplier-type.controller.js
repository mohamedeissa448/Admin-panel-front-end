(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageSupplierTypeController', ManageSupplierTypeController);

    /* @ngInject */
    function ManageSupplierTypeController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.SupplierTypeGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveSupplierTypes();
        function retriveSupplierTypes(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getSupplierTypes",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.SupplierTypeslist = data.data;
            }
            else{
                vm.SupplierTypeslist = data.data;
            }
            vm.SupplierTypeGrid.jsGrid({
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
                data: vm.SupplierTypeslist,
                fields: [
                    { title: "Code", name: "SupplierType_Code", type: "number", width: 35},
                    { title: "Name", name: "SupplierType_Name", type: "text", width: 100},
                    { title: "Desc", name: "SupplierType_Description", type: "text", width: 100},
                    { title: "Active",  name: "SupplierType_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openSupplierTypeToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openSupplierTypeToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditSupplierTypeController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-supplier-type/edit-supplier-type.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.SupplierTypeGrid.innerHTML = "";
                    retriveSupplierTypes();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddSupplierTypeController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-supplier-type/add-supplier-type.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.SupplierTypeGrid.innerHTML = "";
                    retriveSupplierTypes();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getSupplierTypesByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.SupplierTypeslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();