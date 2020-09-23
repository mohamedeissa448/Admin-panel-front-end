(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageProductUnitsController', ManageProductUnitsController);

    /* @ngInject */
    function ManageProductUnitsController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.ProductUnitsGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveProductUnits();
        function retriveProductUnits(){
            $http({
                method:"GET",
                url:"http://localhost:4000/getProductUnits",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.productUnitslist = data.data;
            }
            else{
                vm.productUnitslist = data.data;
            }
            vm.ProductUnitsGrid.jsGrid({
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
                data: vm.productUnitslist,
                fields: [
                    { title: "Name", name: "ProductUnit_Name", type: "text", width: 100},
                    { title: "Desc", name: "ProductUnit_Description", type: "text", width: 100},
                    { title: "Active",  name: "ProductUnit_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openProductUnitToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openProductUnitToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditProductUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-product-units/edit-product-unit.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.ProductUnitsGrid.innerHTML = "";
                    retriveProductUnits();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddProductUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-product-units/add-product-unit.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.ProductUnitsGrid.innerHTML = "";
                    retriveProductUnits();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://localhost:4000/getProductUnitsByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.productUnitslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();