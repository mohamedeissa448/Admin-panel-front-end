(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageCountryController', ManageCountryController);

    /* @ngInject */
    function ManageCountryController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.CountryGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveCountry();
        function retriveCountry(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getCountries",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Countryslist = data.data;
            }
            else{
                vm.Countryslist = data.data;
            }
            vm.CountryGrid.jsGrid({
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
                data: vm.Countryslist,
                fields: [
                    { title: "SN", name: "Country_Code", type: "number", width: 15},
                    { title: "Country Name", name: "Country_Name", type: "text", width: 190},
                    { title: "Active",  name: "Country_IsActive", type: "checkbox", width: 30},
                    { title: "",  width: 10, align: "center",
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
                controller: 'EditCountryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-countries/edit-country.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.CountryGrid.innerHTML = "";
                    retriveCountry();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddCountryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-countries/add-country.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.CountryGrid.innerHTML = "";
                    retriveCountry();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getCountriesByName',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Countryslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();