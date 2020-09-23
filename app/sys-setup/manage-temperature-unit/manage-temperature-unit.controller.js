(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageTemperatureUnitController', ManageTemperatureUnitController);

    /* @ngInject */
    function ManageTemperatureUnitController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.TemperatureUnitsGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveTemperatureUnits();
        function retriveTemperatureUnits(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getTemperatureUnit",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.TemperatureUnitsList = data.data;
            }
            else{
                vm.TemperatureUnitsList = data.data;
            }
            vm.TemperatureUnitsGrid.jsGrid({
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
                data: vm.TemperatureUnitsList,
                fields: [
                    { title: "Code", name: "TemperatureUnit_Code", type: "number", width: 35},
                    { title: "Temperature Unit", name: "TemperatureUnit_Name", type: "text", width: 100},
                    { title: "Desc", name: "TemperatureUnit_Description", type: "text", width: 100},
                    { title: "Active",  name: "TemperatureUnit_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openTemperatureUnitToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openTemperatureUnitToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditTemperatureUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-temperature-unit/edit-temperature-unit.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.TemperatureUnitsGrid.innerHTML = "";
                    retriveTemperatureUnits();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddTemperatureUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-temperature-unit/add-temperature-unit.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.TemperatureUnitsGrid.innerHTML = "";
                    retriveTemperatureUnits();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.TemperatureUnitSearch;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getTemperatureUnitByname',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.TemperatureUnitsList =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();