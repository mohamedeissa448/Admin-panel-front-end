(function() {
    'use strict';

    angular
        .module('manageuser')
        .controller('ResetEmployeePasswordController', ResetEmployeePasswordController);

    /* @ngInject */
    function ResetEmployeePasswordController($http,$mdDialog, $mdToast, triLoaderService, EmployeeToEdit) {
        var vm = this;
        vm.SelectedEmployee = EmployeeToEdit;
        console.log(vm.SelectedEmployee)
        vm.ResetPassword = function(){
           
            if(vm.EmployeeData.password == vm.EmployeeData.confirm){
                var DataToSend = {};
                DataToSend.id =  EmployeeToEdit.User_Code;
                DataToSend.password = vm.EmployeeData.password;
                $http({
                    method:"POST",
                    url:"http://35.246.143.96:3111/changePassword",
                    data :DataToSend
                }).then(function(data){
                    if(data.data.message != true){
                        showAddErrorToast("Password Can not be Changed",$mdToast);
                    }
                    else{
                        showAddToast("Password Changed Successfully",$mdToast);
                        vm.ULogedInUser = {};
                        $mdDialog.hide();
                        
                    }
                })
            }
            else{
                showAddErrorToast('Password and Confirm Password not identical',$mdToast);
            }
        }
        vm.closeWindow = function(){
            $mdDialog.hide();
        }
    }
    
})();