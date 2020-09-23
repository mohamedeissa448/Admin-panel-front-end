(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageWeightUnitController', ManageWeightUnitController);

    /* @ngInject */
    function ManageWeightUnitController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.WeightUnitsGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveWeightUnits();
        function retriveWeightUnits(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getWeight",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.WeightUnitsList = data.data;
            }
            else{
                vm.WeightUnitsList = data.data;
            }
            vm.WeightUnitsGrid.jsGrid({
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
                data: vm.WeightUnitsList,
                fields: [
                    { title: "Code", name: "Weight_Code", type: "number", width: 35},
                    { title: "Weight Unit", name: "Weight_Name", type: "text", width: 100},
                    { title: "Desc", name: "Weight_Description", type: "text", width: 100},
                    { title: "Active",  name: "Weight_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openWeightUnitToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openWeightUnitToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditWeightUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-weight-unit/edit-weight-unit.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.WeightUnitsGrid.innerHTML = "";
                    retriveWeightUnits();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddWeightUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-weight-unit/add-weight-unit.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.WeightUnitsGrid.innerHTML = "";
                    retriveWeightUnits();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getWeightByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.WeightUnitsList =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();