(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageFormController', ManageFormController);

    /* @ngInject */
    function ManageFormController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.FormGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveForm();
        function retriveForm(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getForm",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Formslist = data.data;
            }
            else{
                vm.Formslist = data.data;
            }
            vm.FormGrid.jsGrid({
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
                data: vm.Formslist,
                fields: [
                    { title: "Code", name: "Form_Code", type: "number", width: 35},
                    { title: "Form Name", name: "Form_Name", type: "text", width: 100},
                    { title: "Desc", name: "Form_Description", type: "text", width: 100},
                    { title: "Active",  name: "Form_IsActive", type: "checkbox", width: 40},
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
                controller: 'EditFormController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-form/edit-form.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.FormGrid.innerHTML = "";
                    retriveForm();
                },
                locals: {
                    Form_Code: itemToEdit.Form_Code,
                    Form_Name: itemToEdit.Form_Name,
                    Form_Description: itemToEdit.Form_Description,
                    Form_IsActive: itemToEdit.Form_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddFormController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-form/add-form.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.FormGrid.innerHTML = "";
                    retriveForm();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getFormByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Formslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();