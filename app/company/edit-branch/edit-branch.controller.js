(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('EditBranchController', EditBranchController);

    /* @ngInject */
    function EditBranchController($mdToast,$mdDialog, triLoaderService,$http,Branch_Code, Branch_Name, Branch_Location, Branch_Related_To_Company,Branch_Type_Of_Business,Branch_Has_Inventories,Branch_Accountant) {
        var vm = this;
        $http.get("http://localhost:4000/getTypesOfBusiness").then(function (response) {			   
            vm.typesOfBusiness = response.data;
        });
        $http.get("http://localhost:4000/companies/getAll").then(function (response) {			   
            vm.companies = response.data;
        })
        vm.Branch = {};
        vm.Branch.Branch_Code = Branch_Code ;
        vm.Branch.Branch_Name = Branch_Name ;
        vm.Branch.Branch_Location = Branch_Location ;
        vm.Branch.Branch_Has_Inventories = Branch_Has_Inventories ;
        vm.Branch.Branch_Related_To_Company = Branch_Related_To_Company._id ;
        vm.Branch.Branch_Accountant = Branch_Accountant ;
        vm.Branch.Branch_Type_Of_Business = Branch_Type_Of_Business._id ;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
         
            $http({
                method:'POST',
                url:'http://localhost:4000/branches/editBranchByCode',
                data :JSON.stringify(vm.Branch)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Branch edited successfully',$mdToast);
                    $mdDialog.hide();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };

    }
})();