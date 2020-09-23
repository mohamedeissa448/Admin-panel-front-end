(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditFormController', EditFormController);

    /* @ngInject */
    function EditFormController($mdToast,$mdDialog, triLoaderService,$http,Form_Code, Form_Name, Form_Description, Form_IsActive) {
        var vm = this;
        vm.Form = {};
        vm.Form.Form_Code = Form_Code;
        vm.Form.Form_Name = Form_Name;
        vm.Form.Form_Description = Form_Description;
        if(Form_IsActive == 1){
            vm.Form_IsActive = true
        }
        else{
            vm.Form_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.Form_IsActive == true){
                vm.Form.Form_IsActive = 1;
            }
            else{
                vm.Form.Form_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditForm',
                data :JSON.stringify(vm.Form)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Form edited successfully',$mdToast);
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