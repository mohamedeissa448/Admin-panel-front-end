(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('ManageCompanyController', ManageCompanyController);

    /* @ngInject */
    function ManageCompanyController($mdDialog,$http) {
        var vm = this;
        vm.CompanyGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveCompanies();
        function retriveCompanies(){
            $http({
                method:"GET",
                url:"http://localhost:4000/companies/getAll",
                data :{}
            }).then(function(data){
                console.log("data",data)
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Companieslist = data.data;
            }
            else{
                vm.Companieslist = data.data;
            }
            vm.CompanyGrid.jsGrid({
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
                data: vm.Companieslist,
                fields: [
                    { title: "Code", name: "Company_Code", type: "number", width: 35},
                    { title: "Company Name", name: "Company_Name", type: "text", width: 100},
                    { title: "Telephone", name: "Company_Telephone", type: "text", width: 100},
                    { title: "Website", name: "Company_WebSite", type: "text", width: 100},
                    { title: "Email", name: "Company_Email", type: "text", width: 60},
                    { title: "Info",  name: "Company_Info", type: "text", width: 100},
    
                    { title: "Edit",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openCompanyToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function openCompanyToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditCompanyController',
                controllerAs: 'vm',
                templateUrl: 'app/company/edit-company/edit-company.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.CompanyGrid.innerHTML = "";
                    retriveCompanies();
                },
                locals: {
                    Company_Code      : itemToEdit.Company_Code,
                    Company_Name      : itemToEdit.Company_Name,
                    Company_Telephone : itemToEdit.Company_Telephone,
                    Company_WebSite   : itemToEdit.Company_WebSite,
                    Company_Email     : itemToEdit.Company_Email,
                    Company_Info      : itemToEdit .Company_Info     
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddCompanyController',
                controllerAs: 'vm',
                templateUrl: 'app/company/add-company/add-company.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.CompanyGrid.innerHTML = "";
                    retriveCompanies();
                }
            });
        }
        vm.SubmitSearch= function(){
            if(vm.selectSearchType == 'Company_Name'){
                vm.SearchFor.propertySearched = 'Company_Name';
            }else if(vm.selectSearchType == 'Company_Code'){
                vm.SearchFor.propertySearched = 'Company_Code';
            }
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://localhost:4000/companies/searchCompany',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Companieslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
            
        }
    }
})();