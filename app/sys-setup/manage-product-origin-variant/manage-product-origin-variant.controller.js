(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageProductOriginVariantController', ManageProductOriginVariantController);

    /* @ngInject */
    function ManageProductOriginVariantController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.OriginVariantsGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveOriginVariants();
        function retriveOriginVariants(){
            $http({
                method:"GET",
                url:"http://localhost:4000/getOriginVariants",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.originVariantslist = data.data;
            }
            else{
                vm.originVariantslist = data.data;
            }
            vm.OriginVariantsGrid.jsGrid({
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
                data: vm.originVariantslist,
                fields: [
                    { title: "Name", name: "ProductOrigin_Name", type: "text", width: 100},
                    { title: "Desc", name: "ProductOrigin_Description", type: "text", width: 100},
                    { title: "Active",  name: "ProductOrigin_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openOriginVariantToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openOriginVariantToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditOriginVariantController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-product-origin-variant/edit-product-origin-variant.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.OriginVariantsGrid.innerHTML = "";
                    retriveOriginVariants();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddOriginVariantController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-product-origin-variant/add-product-origin-variant.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.OriginVariantsGrid.innerHTML = "";
                    retriveOriginVariants();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://localhost:4000/getOriginVariantsByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.originVariantslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();