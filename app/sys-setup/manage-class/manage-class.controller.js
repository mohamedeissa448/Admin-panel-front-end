(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageClassController', ManageClassController);

    /* @ngInject */
    function ManageClassController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.CategoryGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveCategories();
        function retriveCategories(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getClasses",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Categorieslist = data.data;
            }
            else{
                vm.Categorieslist = data.data;
            }
            vm.CategoryGrid.jsGrid({
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
                data: vm.Categorieslist,
                fields: [
                    { title: "Code", name: "Class_Code", type: "number", width: 35},
                    { title: "Class Name", name: "Class_Name", type: "text", width: 100},
                    { title: "Desc", name: "Class_Description", type: "text", width: 100},
                    { title: "Active",  name: "Class_IsActive", type: "checkbox", width: 40},
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
                controller: 'EditClassController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-class/edit-class.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.CategoryGrid.innerHTML = "";
                    retriveCategories();
                },
                locals: {
                    Class_Code: itemToEdit.Class_Code,
                    Class_Name: itemToEdit.Class_Name,
                    Class_Description: itemToEdit.Class_Description,
                    Class_IsActive: itemToEdit.Class_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddClassController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-class/add-class.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.CategoryGrid.innerHTML = "";
                    retriveCategories();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getClassByName',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Categorieslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();