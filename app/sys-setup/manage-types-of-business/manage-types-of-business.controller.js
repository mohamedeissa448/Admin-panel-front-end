(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageTypesOfBusinessController', ManageTypesOfBusinessController);

    /* @ngInject */
    function ManageTypesOfBusinessController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.TypesOfBusinessGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveTypesOfBusiness();
        function retriveTypesOfBusiness(){
            $http({
                method:"GET",
                url:"http://localhost:4000/getTypesOfBusiness",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.TypesOfBusinesslist = data.data;
            }
            else{
                vm.TypesOfBusinesslist = data.data;
            }
            vm.TypesOfBusinessGrid.jsGrid({
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
                data: vm.TypesOfBusinesslist,
                fields: [
                    { title: "Code", name: "Type_Of_Business_Code", type: "number", width: 35},
                    { title: "Name", name: "Type_Of_Business_Name", type: "text", width: 100},
                    { title: "Desc", name: "Type_Of_Business_Description", type: "text", width: 100},
                    { title: "Active",  name: "Type_Of_Business_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openTypesOfBusinessToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openTypesOfBusinessToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditTypesOfBusinessController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-types-of-business/edit-types-of-business.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.TypesOfBusinessGrid.innerHTML = "";
                    retriveTypesOfBusiness();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddTypesOfBusinessController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-types-of-business/add-types-of-business.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.TypesOfBusinessGrid.innerHTML = "";
                    retriveTypesOfBusiness();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://localhost:4000/getTypesOfBusinessByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.TypesOfBusinesslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();