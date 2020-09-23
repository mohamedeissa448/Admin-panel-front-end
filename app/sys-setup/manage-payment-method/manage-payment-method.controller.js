(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManagePaymentMethodController', ManagePaymentMethodController);

    /* @ngInject */
    function ManagePaymentMethodController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.PaymentMethodGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retrivePaymentMethod();
        function retrivePaymentMethod(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getPaymentMethods",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.PaymentMethodlist = data.data;
            }
            else{
                vm.PaymentMethodlist = data.data;
            }
            vm.PaymentMethodGrid.jsGrid({
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
                data: vm.PaymentMethodlist,
                fields: [
                    { title: "Code", name: "PaymentMethod_Code", type: "number", width: 35},
                    { title: "Payment Method Name", name: "PaymentMethod_Name", type: "text", width: 100},
                    { title: "Desc", name: "PaymentMethod_Description", type: "text", width: 100},
                    { title: "Active",  name: "PaymentMethod_IsActive", type: "checkbox", width: 40},
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openCategortToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        

        function openCategortToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditPaymentMethodController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-payment-method/edit-payment-method.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.PaymentMethodGrid.innerHTML = "";
                    retrivePaymentMethod();
                },
                locals: {
                    PaymentMethod_Code: itemToEdit.PaymentMethod_Code,
                    PaymentMethod_Name: itemToEdit.PaymentMethod_Name,
                    PaymentMethod_Description: itemToEdit.PaymentMethod_Description,
                    PaymentMethod_IsActive: itemToEdit.PaymentMethod_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddPaymentMethodController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-payment-method/add-payment-method.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.PaymentMethodGrid.innerHTML = "";
                    retrivePaymentMethod();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getPaymentMethodsByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.PaymentMethodlist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();