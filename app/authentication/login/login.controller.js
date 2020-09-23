(function() {
    'use strict';

    angular
        .module('nonoauthentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($http, $mdToast, $cookies, triSettings, $state, PermissionStore, RoleStore, UserService) {
        var vm = this;
        vm.isNotLoding = true;
        vm.loginClick = loginClick;
        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.user = {
            email: '',
            password: ''
        };

        ////////////////

        function loginClick() {
            vm.isNotLoding = false;
            var userDataToLogin = {
                user_name : vm.user.user_name,
                password: vm.user.password
            };
            $http({
                method : 'POST',
                url : 'http://localhost:4000/login',
                data: userDataToLogin
            }).then(function(dataResult){
                if(dataResult.data.status == false){
                    showInvalidUserToast();
                    vm.isNotLoding = true;
                }
                else{
                    if(vm.user.rememberMe){
                        var todayDate = new Date();
                        var expireDate = new Date();
                        expireDate.setDate(todayDate.getDate() +14);
                        //angular.fromJson
                        $cookies.put('nonocpuser', angular.toJson(userDataToLogin) , {
                            expires: expireDate
                        });
                    }
                    doLogin(dataResult.data);
                }
            });
            
            // var today = new Date();
            // var expire = new Date();
            // expire.setDate(today.getDate() +14);
            // alert(expire);
        }
        function doLogin(userdata){
            var currentUser = {
                displayName: userdata.User_DisplayName,
                username:userdata.User_Name,
                id: userdata.User_Code,
                mongoID: userdata._id,
                avatar: 'assets/images/avatars/avatar-5.png',
                roles: ['LOGEDUSER'],
                permissions : userdata.User_Permissions
            };
            sessionStorage.currentUser = angular.toJson(currentUser);
            PermissionStore.defineManyPermissions(userdata.User_Permissions, function (permissionName) {
                return UserService.hasPermission(permissionName,currentUser);
            });
            RoleStore.defineManyRoles({
                'LOGEDUSER': userdata.User_Permissions
            });
            $state.go('triangular.home');
        }

        function showInvalidUserToast() {
            $mdToast.show({
                template: '<md-toast><md-icon class="rxp-red-message-icon" md-font-icon="zmdi zmdi-lock"></md-icon><span flex> No Such User </span></md-toast>',
                position: 'bottom right',
                hideDelay: 4000
            });
        }
    }
})();
