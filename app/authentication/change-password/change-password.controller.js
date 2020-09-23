(function() {
    'use strict';

    angular
        .module('nonoauthentication')
        .controller('ChangePasswordController', ChangePasswordController);

    /* @ngInject */
    function ChangePasswordController($http,triLoaderService,UserService,$mdToast) {
        var vm = this;
        vm.ULogedInUser = UserService.getCurrentUser();
        vm.ULogedInUser.current = '';
        vm.ULogedInUser.password = '';
        vm.SubmitChangePassword = function(){
            triLoaderService.setLoaderActive(true);
            var dataToSend = {};
            dataToSend.User_Code = vm.ULogedInUser.id;
            dataToSend.old_password = vm.ULogedInUser.current;
            dataToSend.new_password = vm.ULogedInUser.password;
            console.log(dataToSend);
            try{
                $http({
                    method:"POST",
                    url:"http://35.246.143.96:3111/changeMyPassword",
                    data :dataToSend
                }).then(function(data){
                    if(data.data.message){
                        showAddToast("Password Changed Successfully",$mdToast);
                        vm.ULogedInUser = {};
                    }
                    else{
                        showAddErrorToast("Password Can not be Changed",$mdToast);
                    }
                    triLoaderService.setLoaderActive(false);
                    
                })
            }
            catch(err){
                showAddErrorToast("Password Can not be Changed",$mdToast)
            }
        }
    }
})();