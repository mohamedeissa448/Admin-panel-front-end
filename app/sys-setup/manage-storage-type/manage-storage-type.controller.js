(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageStorageTypeController', ManageStorageTypeController);

    /* @ngInject */
    function ManageStorageTypeController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.StorageTypeGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveStorageType();
        function retriveStorageType(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getStorageType",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.StorageTypeList = data.data;
            }
            else{
                vm.StorageTypeList = data.data;
            }
            vm.StorageTypeGrid.jsGrid({
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
                data: vm.StorageTypeList,
                fields: [
                    { title: "Code", name: "StorageType_Code", type: "number", width: 35},
                    { title: "Storage Name", name: "StorageType_Name", type: "text", width: 100},
                    { title: "Desc", name: "StorageType_Description", type: "text", width: 100},
                    { title: "Active",  name: "StorageType_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openStorageTypeToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openStorageTypeToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditStorageTypeController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-storage-type/edit-storage-type.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.StorageTypeGrid.innerHTML = "";
                    retriveStorageType();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddStorageTypeController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-storage-type/add-storage-type.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.StorageTypeGrid.innerHTML = "";
                    retriveStorageType();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getStorageTypeByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.StorageTypeList =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();