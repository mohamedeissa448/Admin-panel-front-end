(function() {
    'use strict';

    angular
        .module('manageuser')
        .controller('EditUserAllowedCustomerController', EditUserAllowedCustomerController);

    /* @ngInject */
    function EditUserAllowedCustomerController($mdToast, $mdDialog,$http,UserToEdit) {
        var vm = this;
        vm.isLoading = true;
        vm.UserData = UserToEdit;
        if(vm.UserData.User_Access_All_Customers == 1){
            vm.UserData.User_Access_All_Customers = true;
        }
        $http({
            method:'POST',
            url:'http://localhost:4000/getUserAccessCustomers',
            data : {User_Code:UserToEdit.User_Code}
        }).then(function(data){			   
            vm.userAllowedCustomerData = data.data[0];
            if(vm.userAllowedCustomerData.User_Allowed_Customers &&  vm.userAllowedCustomerData.customer){
                vm.selectedCustomers = vm.userAllowedCustomerData.customer;
                // console.log(vm.selectedCustomers)
                // console.log(vm.userAllowedCustomerData);
            }
            else{
                vm.selectedCustomers = [];
            }
                
        }).then(function(){
                $http.get("http://35.246.143.96:3111/getCustomer").then(function (response) {			   
                vm.selectedCustomerItem = null;
                vm.searchCustomerText = null;
                vm.queryCustomer = queryCustomer;
                vm.Customers = response.data;
                vm.transformChip = transformChip;   
                function queryCustomer($query) {
                    var lowercaseQuery = angular.lowercase($query);
                    return vm.Customers.filter(function(cust) {
                        var lowercaseName = angular.lowercase(cust.Customer_Name);
                        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                            return cust;
                        }
                    });
                }
                vm.isLoading = false;
            })
        });
        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }
        vm.SubmitData = function(){
            vm.customerError = false;
            vm.isLoading = true;
            // if(vm.UserData.User_Access_All_Customers == true){
            //     vm.UserData.User_Access_All_Customers = 1;
            // }
            var User_Access_All_Customers = 0;
            var selectedCustomerIDs = [];
            if(vm.UserData.User_Access_All_Customers){
                User_Access_All_Customers = 1
            }
            else{
                if(vm.selectedCustomers.length>0){
                    vm.selectedCustomers = removeDuplicates(vm.selectedCustomers);
                    vm.selectedCustomers.forEach(function(Item,index){
                        selectedCustomerIDs.push(Item.Customer_Code)
                    });
                }
                else{
                    vm.customerError = true;
                    vm.isLoading = false;
                    return
                }
                
            }

            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/editUserAccessCustomers',
                data : {User_Code:UserToEdit.User_Code, User_Access_All_Customers:User_Access_All_Customers,User_Allowed_Customers : selectedCustomerIDs}
            }).then(function(data){			   
                console.log(data);
                vm.isLoading = false;
                showAddToast('Allowed Customer has changed successfully',$mdToast);
            })
            
        }
        vm.AllowedAllCustomerChanged = function(){
            vm.selectedCustomers = [];
        }
        //getUserAccessCustomers
        vm.ConfirmCloseDialog = function(){
            if(vm.allowedCustomerdForm.$dirty){
                var Result;
                $mdDialog.show({
                    multiple: true,skipHide: true,
                    controllerAs:'confirmDialog',
                    bindToController: true,
                    controller: function($mdDialog){
                        var vmc = this;
                        vmc.closeform = function closeform(){
                            $mdDialog.hide();
                            Result =  true;
                        }
                        vmc.hide = function hide(){
                            $mdDialog.hide();
                            Result = false;
                        }
                    }
                    ,template: GetConfirmCloseTemplate()
                }).then(function() {
                    if(Result){
                        $mdDialog.hide();
                    }
                });
            }
            else
                $mdDialog.hide();
        }
    }
})();