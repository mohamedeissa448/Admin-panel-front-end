(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditClassController', EditClassController);

    /* @ngInject */
    function EditClassController($mdToast,$mdDialog, triLoaderService,$http,Class_Code, Class_Name, Class_Description, Class_IsActive) {
        var vm = this;
        vm.Class = {};
        vm.Class.Class_Code = Class_Code;
        vm.Class.Class_Name = Class_Name;
        vm.Class.Class_Description = Class_Description;
        if(Class_IsActive == 1){
            vm.Class_IsActive = true
        }
        else{
            vm.Class_IsActive = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.Class_IsActive == true){
                vm.Class.Class_IsActive = 1;
            }
            else{
                vm.Class.Class_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditSupplierClass',
                data :JSON.stringify(vm.Class)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Class edited successfully',$mdToast);
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