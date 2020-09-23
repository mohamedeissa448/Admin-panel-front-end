(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageConcentrationController', ManageConcentrationController);

    /* @ngInject */
    function ManageConcentrationController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.ConcentrationGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveConcentration();
        function retriveConcentration(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getConcentration",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.ConcentrationsList = data.data;
            }
            else{
                vm.ConcentrationsList = data.data;
            }
            vm.ConcentrationGrid.jsGrid({
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
                data: vm.ConcentrationsList,
                fields: [
                    { title: "Code", name: "Concentration_Code", type: "number", width: 35},
                    { title: "Concentration Name", name: "Concentration_Name", type: "text", width: 100},
                    { title: "Desc", name: "Concentration_Description", type: "text", width: 100},
                    { title: "Active",  name: "Concentration_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openConcentrationToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openConcentrationToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditConcentrationController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-concentration/edit-concentration.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.ConcentrationGrid.innerHTML = "";
                    retriveConcentration();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddConcentrationController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-concentration/add-concentration.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.ConcentrationGrid.innerHTML = "";
                    retriveConcentration();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getConcentrationByName',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.ConcentrationsList =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();