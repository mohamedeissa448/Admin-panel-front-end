(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageReleaseTypeController', ManageReleaseTypeController);

    /* @ngInject */
    function ManageReleaseTypeController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.ReleaseTypeGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveReleaseType();
        function retriveReleaseType(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getReleaseType",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.ReleaseTypelist = data.data;
            }
            else{
                vm.ReleaseTypelist = data.data;
            }
            vm.ReleaseTypeGrid.jsGrid({
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
                data: vm.ReleaseTypelist,
                fields: [
                    { title: "Code", name: "ReleaseType_Code", type: "number", width: 35},
                    { title: "Name", name: "ReleaseType_Name", type: "text", width: 100},
                    { title: "Desc", name: "ReleaseType_Description", type: "text", width: 100},
                    { title: "Active",  name: "ReleaseType_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openReleaseTypeToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openReleaseTypeToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditReleaseTypeController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-release-type/edit-release-type.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.ReleaseTypeGrid.innerHTML = "";
                    retriveReleaseType();
                },
                locals: {
                    itemToEdit:itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddReleaseTypeController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-release-type/add-release-type.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.ReleaseTypeGrid.innerHTML = "";
                    retriveReleaseType();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getReleaseTypeByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.ReleaseTypelist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();