(function() {
    'use strict';

    angular
        .module('managecompanies')
        .controller('EditCompanyController', EditCompanyController);

    /* @ngInject */
    function EditCompanyController($mdToast,$mdDialog, triLoaderService,$http,Company_Code, Company_Name, Company_Telephone, Company_WebSite,Company_Email,Company_Info) {
        var vm = this;
        vm.Company = {};
        vm.Company.Company_Code = Company_Code;
        vm.Company.Company_Name = Company_Name;
        vm.Company.Company_Telephone = Company_Telephone;
        vm.Company.Company_WebSite = Company_WebSite;
        vm.Company.Company_Email = Company_Email;
        vm.Company.Company_Info = Company_Info;
        
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
         
            $http({
                method:'POST',
                url:'http://localhost:4000/companies/editCompanyByCode',
                data :JSON.stringify(vm.Company)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Company edited successfully',$mdToast);
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