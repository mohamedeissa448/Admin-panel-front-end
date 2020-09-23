(function() {
    'use strict';

    angular
        .module('manageuser')
        .controller('EditUserAllowedSupplierController', EditUserAllowedSupplierController);

    /* @ngInject */
    function EditUserAllowedSupplierController($mdToast, $mdDialog,$http,UserToEdit) {
        var vm = this;
        vm.isLoading = true;
        vm.UserData = UserToEdit;
        if(vm.UserData.User_Access_All_Suppliers == 1){
            vm.UserData.User_Access_All_Suppliers = true;
        }
        $http({
            method:'POST',
            url:'http://localhost:4000/getUserAccessSuppliers',
            data : {User_Code:UserToEdit.User_Code}
        }).then(function(data){			   
            vm.userAllowedSupplierData = data.data[0];
            if(vm.userAllowedSupplierData.User_Allowed_Suppliers &&  vm.userAllowedSupplierData.supplier){
                vm.selectedSuplliers = vm.userAllowedSupplierData.supplier;
                // console.log(vm.selectedSuplliers)
                // console.log(vm.userAllowedSupplierData);
            }
            else{
                vm.selectedSuplliers = [];
            }
                
        }).then(function(){
                $http.get("http://35.246.143.96:3111/getSupplier").then(function (response) {			   
                    vm.selectedSupplierItem = null;
                    vm.searchSupplierText = null;
                    vm.querySupplier = querySupplier;
                    vm.Suppliers = response.data;
                    vm.transformChip = transformChip;   
                    function querySupplier($query) {
                        var lowercaseQuery = angular.lowercase($query);
                        return vm.Suppliers.filter(function(supp) {
                            var lowercaseName = angular.lowercase(supp.Supplier_Name);
                            if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                                return supp;
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
            vm.supplierError = false;
            vm.isLoading = true;
            // if(vm.UserData.User_Access_All_Suppliers == true){
            //     vm.UserData.User_Access_All_Suppliers = 1;
            // }
            var User_Access_All_Suppliers = 0;
            var selectedSuppliers = [];
            if(vm.UserData.User_Access_All_Suppliers){
                User_Access_All_Suppliers = 1
            }
            else{
                if(vm.selectedSuplliers.length>0){
                    vm.selectedSuplliers = removeDuplicates(vm.selectedSuplliers);
                    vm.selectedSuplliers.forEach(function(Item,index){
                        selectedSuppliers.push(Item.Supplier_Code)
                    });
                }
                else{
                    vm.supplierError = true;
                    vm.isLoading = false;
                    return
                }
                
            }

            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/editUserAccessSuppliers',
                data : {User_Code:UserToEdit.User_Code, User_Access_All_Suppliers:User_Access_All_Suppliers,User_Allowed_Suppliers : selectedSuppliers}
            }).then(function(data){			   
                console.log(data);
                vm.isLoading = false;
                showAddToast('Allowed Suppliers has changed successfully',$mdToast);
            })
            
        }
        vm.AllowedAllSupplierChanged = function(){
            vm.selectedSuplliers = [];
        }
        //getUserAccessCustomers
        vm.ConfirmCloseDialog = function(){
            if(vm.allowedSupplierForm.$dirty){
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