(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('SearchUserController', SearchUserController);

    /* @ngInject */
    function SearchUserController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        vm.UsersGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveUsers();
        function retriveUsers(){
            $http({
                method:"GET",
                url:"http://localhost:4000/getAllUsers",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            console.log(data)
            if(!fromsearch){
                vm.UsersList = data.data;
            }
            else{
                vm.UsersList = data.data;
            }
            vm.UsersGrid.jsGrid({
                width: "100%",
                height: "400px",
                autoload: false,
                sorting: true,
                selecting: false,
                paging: true,
                inserting: false,
                editing: false,
                pageIndex: 1,
                pageSize: 20,
                pageButtonCount: 15,
                data: vm.UsersList,
                fields: [
                    { title: "Code", name: "User_Code", type: "number", width: 35},
                    { title: "User Name", name: "User_Name", type: "text", width: 100},
                    { title: "Display Name", name: "User_DisplayName", type: "text", width: 100},
                    { title: "Active",  name: "User_IsActive", type: "checkbox", width: 40},
                    { title: "Product", width: 35,  align: "center",
                        itemTemplate: function(value, item) {
                            var $mainContainer = $("<div>")
                            var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-product-sacessbtt md-button md-cyan-theme md-ink-ripple").text("")
                            .on("click", function () {
                                ChangeAllowedProducts(item);
                            }).attr('title', 'Modify allowed products') ;
                            var $checkBox = $("<input>").text("").attr('type', 'checkbox')
                            .attr("disabled", true).prop("checked", item.User_Access_All_Products)
                            .attr('value', item.User_Access_All_Products).attr('name','allproducts') ;
                            //$mainContainer = $mainContainer.extend($link);
                            //$mainContainer = $link.add($checkBox);
                            var $lable = $("<label>").text("All").attr('for', 'allproducts').attr("class","rxp-ingrid-checkbox-label");
                            $mainContainer = $link.add($checkBox).add($lable);
                            return $mainContainer;
                        }
                    },
                    { title: "Customers", width: 35,  align: "center",
                        itemTemplate: function(value, item) {
                            var $mainContainer = $("<div>")
                            var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-customer-sacessbtt md-button md-cyan-theme md-ink-ripple").text("")
                            .on("click", function () {
                                ChangeAllowedCustomers(item);
                            }).attr('title', 'Modify allowed customers') ;
                            var $checkBox = $("<input>").text("").attr('type', 'checkbox')
                            .attr("disabled", true).prop("checked", item.User_Access_All_Customers)
                            .attr('value', item.User_Access_All_Customers).attr('name','allcustomer') ;
                            //$mainContainer = $mainContainer.extend($link);
                            //$mainContainer = $link.add($checkBox);
                            var $lable = $("<label>").text("All").attr('for', 'allcustomer').attr("class","rxp-ingrid-checkbox-label");
                            $mainContainer = $link.add($checkBox).add($lable);
                            return $mainContainer;
                        }
                    },
                    { title: "Supplier", width: 35,  align: "center",
                        itemTemplate: function(value, item) {
                            var $mainContainer = $("<div>")
                            var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-supplier-sacessbtt md-button md-cyan-theme md-ink-ripple").text("")
                            .on("click", function () {
                                ChangeAllowedSuppliers(item);
                            }).attr('title', 'Modify allowed supplier') ;
                            var $checkBox = $("<input>").text("").attr('type', 'checkbox')
                            .attr("disabled", true).prop("checked", item.User_Access_All_Suppliers)
                            .attr('value', item.User_Access_All_Suppliers).attr('name','allsuppliers') ;
                            //$mainContainer = $mainContainer.extend($link);
                            //$mainContainer = $link.add($checkBox);
                            var $lable = $("<label>").text("All").attr('for', 'allsuppliers').attr("class","rxp-ingrid-checkbox-label");
                            $mainContainer = $link.add($checkBox).add($lable);
                            return $mainContainer;
                        }
                    },
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-permissionbtt  md-button md-cyan-theme md-ink-ripple")
                        .text("").attr("title","Modify Permissions")
                        .on("click", function () {
                            openUserToEditPermissions(item);
                        }) ;
                        return $link;
                    }},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-passwordbtt  md-button md-cyan-theme md-ink-ripple")
                        .text("").attr("title","Change Password")
                        .on("click", function () {
                            openUserToResetPassword(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function openUserToResetPassword(itemToEdit){
            $mdDialog.show({
                controller: 'ResetEmployeePasswordController',
                controllerAs: 'vm',
                templateUrl: 'app/manage-user/reset-password/reset-password.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                locals: {
                    EmployeeToEdit: itemToEdit
                }
            });
        }
        function ChangeAllowedProducts(itemToEdit){
            $mdDialog.show({
                controller: 'EditUserAllowedProductController',
                controllerAs: 'vm',
                templateUrl: 'app/manage-user/edit-user-allowed-product/edit-user-allowed-product.tmpl.html',
                clickOutsideToClose: false,
                focusOnOpen: false,
                locals: {
                    UserToEdit: itemToEdit
                }
            });
        }
        function ChangeAllowedSuppliers(itemToEdit){
            $mdDialog.show({
                controller: 'EditUserAllowedSupplierController',
                controllerAs: 'vm',
                templateUrl: 'app/manage-user/edit-user-allowed-supplier/edit-user-allowed-supplier.tmpl.html',
                clickOutsideToClose: false,
                focusOnOpen: false,
                locals: {
                    UserToEdit: itemToEdit
                }
            });
        }
        function ChangeAllowedCustomers(itemToEdit){
            $mdDialog.show({
                controller: 'EditUserAllowedCustomerController',
                controllerAs: 'vm',
                templateUrl: 'app/manage-user/edit-user-allowed-customer/edit-user-allowed-customer.tmpl.html',
                clickOutsideToClose: false,
                focusOnOpen: false,
                locals: {
                    UserToEdit: itemToEdit
                }
            });
        }
        function openUserToEditPermissions(itemToEdit){
            $mdDialog.show({
                controller: 'EditUserPermissionController',
                controllerAs: 'vm',
                templateUrl: 'app/manage-user/edit_user_permission/edit_user_permission.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.UsersGrid.innerHTML = "";
                    retriveUsers();
                },
                locals: {
                    SelectedUser: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddUserController',
                controllerAs: 'vm',
                templateUrl: 'app/manage-user/add-user/add-user.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.UsersGrid.innerHTML = "";
                    retriveUsers();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.ProductSearch;
            $http({
                method:"POST",
                url:'http://35.204.1.127:3100/getMedicalCondationByname',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.UsersList =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();