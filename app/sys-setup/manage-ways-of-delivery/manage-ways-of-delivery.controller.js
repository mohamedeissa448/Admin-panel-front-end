(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageWaysOfDeliveryController', ManageWaysOfDeliveryController);

    /* @ngInject */
    function ManageWaysOfDeliveryController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.WaysOfDeliveryGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveWaysOfDelivery();
        function retriveWaysOfDelivery(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getWaysOfDelivery",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.WaysOfDeliverylist = data.data;
            }
            else{
                vm.WaysOfDeliverylist = data.data;
            }
            vm.WaysOfDeliveryGrid.jsGrid({
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
                data: vm.WaysOfDeliverylist,
                fields: [
                    { title: "Code", name: "WayOfDelivary_Code", type: "number", width: 35},
                    { title: "Name", name: "WayOfDelivary_Name", type: "text", width: 100},
                    { title: "Desc", name: "WayOfDelivary_Description", type: "text", width: 100},
                    { title: "Active",  name: "WayOfDelivary_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openWaysOfDeliveryToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openWaysOfDeliveryToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditWaysOfDeliveryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-ways-of-delivery/edit-ways-of-delivery.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.WaysOfDeliveryGrid.innerHTML = "";
                    retriveWaysOfDelivery();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddWaysOfDeliveryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-ways-of-delivery/add-ways-of-delivery.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.WaysOfDeliveryGrid.innerHTML = "";
                    retriveWaysOfDelivery();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getWaysOfDeliveryByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.WaysOfDeliverylist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();