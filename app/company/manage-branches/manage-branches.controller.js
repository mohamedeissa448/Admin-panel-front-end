(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('ManageBranchController', ManageBranchController);

    /* @ngInject */
    function ManageBranchController($mdDialog,$http) {
        var vm = this;
        vm.BranchGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveBranches();
        function retriveBranches(){
            $http({
                method:"GET",
                url:"http://localhost:4000/branches/getAll",
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
            vm.BranchGrid.jsGrid({
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
                    { title: "Company Name", name: "Branch_Related_To_Company.Company_Name", type: "text", width: 100},
                    { title: "Branch Code", name: "Branch_Code", type: "number", width: 35},
                    { title: "Branch Name", name: "Branch_Name", type: "text", width: 100},
                    { title: "Location", name: "Branch_Location", type: "text", width: 100},
                    { title: "Type", name: "Branch_Type_Of_Business.Type_Of_Business_Name", type: "text", width: 100},
                    { title: "Accountant", name: "Branch_Accountant", type: "text", width: 60},
                    { title: "Has Inventories",  name: "Branch_Has_Inventories", type: "checkbox", width: 100},
    
                    { title: "Edit",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openBranchToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function openBranchToEdit(itemToEdit){
            console.log("itemToEdit",itemToEdit)
            $mdDialog.show({
                controller: 'EditBranchController',
                controllerAs: 'vm',
                templateUrl: 'app/company/edit-branch/edit-branch.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.BranchGrid.innerHTML = "";
                    retriveBranches();
                },
                locals: {
                    Branch_Code      : itemToEdit.Branch_Code,
                    Branch_Name      : itemToEdit.Branch_Name,
                    Branch_Location : itemToEdit.Branch_Location,
                    Branch_Related_To_Company   : itemToEdit.Branch_Related_To_Company,
                    Branch_Type_Of_Business  : itemToEdit.Branch_Type_Of_Business,
                    Branch_Accountant     : itemToEdit.Branch_Accountant,
                    Branch_Has_Inventories      : itemToEdit .Branch_Has_Inventories     
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddBranchController',
                controllerAs: 'vm',
                templateUrl: 'app/company/add-branch/add-branch.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.BranchGrid.innerHTML = "";
                    retriveBranches();
                }
            });
        }
        vm.SubmitSearch= function(){
            if(vm.selectSearchType == 'Branch_Name'){
                vm.SearchFor.propertySearched = 'Branch_Name';
            }else if(vm.selectSearchType == 'Branch_Code'){
                vm.SearchFor.propertySearched = 'Branch_Code';
            }
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://localhost:4000/branches/searchBranch',
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