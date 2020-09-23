(function() {
    'use strict';

    angular
        .module('manageuser')
        .controller('AddUserController', AddUserController);

    /* @ngInject */
    function AddUserController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://localhost:4000/addUser',
                data :JSON.stringify(vm.user)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddUserToast();
                    vm.user= {};
                    vm.addUserForm.$setPristine();
                    vm.addUserForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showErrorToast(data.data.message);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
        function showAddUserToast() {
            $mdToast.show({
                template: '<md-toast><md-icon class="nono-green-message-icon" md-font-icon="zmdi zmdi-check"></md-icon><span flex translate> User added successfully</span></md-toast>',
                position: 'bottom right',
                hideDelay: 5000
            });
        }
        function showErrorToast(errormessage) {
                
            $mdToast.show({
                template: '<md-toast><md-icon class="nono-red-message-icon" md-font-icon="zmdi zmdi-close"></md-icon><span flex> '+ errormessage +'</span></md-toast>',
                position: 'bottom right',
                hideDelay: 10000
            });
            
        }
    }
})();