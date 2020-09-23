(function () {
    'use strict';

    angular
        .module('pricerequest')
        .controller('GetCustomersByProductControllerold', GetCustomersByProductControllerold);

    /* @ngInject */
    function GetCustomersByProductControllerold($mdToast, $mdDialog, triLoaderService, $http, productlist) {
        var vmr = this;
        vmr.Productslist = productlist;
        vmr.searchForproduct = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vmr.Productslist.filter(function (product) {
                var lowercaseName = angular.lowercase(product.Product_Name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return product;
                }
            });
            return results;
        };
        console.log(vmr.Productslist);
        vmr.Customerslist = [];

        vmr.isChecked = function () {
            return vmr.selected.length === vmr.Customerslist.length;
        };

        vmr.toggleAll = function () {
            if (vmr.selected.length === vmr.Customerslist.length) {
                vmr.selected = [];
            } else if (vmr.selected.length === 0 || vmr.selected.length > 0) {
                vmr.selected = vmr.Customerslist.slice(0);
            }
        };
        vmr.isIndeterminate = function () {
            return (vmr.selected.length !== 0 &&
                vmr.selected.length !== vmr.Customerslist.length);
        };
        vmr.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
        vmr.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };
        vmr.selected = [];
        vmr.SubmitSearchproduct = function () {
            console.log(vmr.selectedProduct);
            vmr.Customerslist = vmr.selectedProduct.customer;
            console.log(vmr.Customerslist);

        }
        vmr.submitSelectCustomer = function () {
            vmr.SelectedCustomerLest = [];
            var SelectedCustomer = [];
            angular.copy(vmr.selected, SelectedCustomer);
            SelectedCustomer.forEach(function (v) {
                var customer = {
                    Customer_Code: v.Customer_Code,
                    Customer_Name: v.Customer_Name,
                    Customer_Email: v.Customer_Email
                }
                vmr.SelectedCustomerLest.push(customer)
            })
            $mdDialog.hide(vmr.SelectedCustomerLest);
            //console.log(vmr.SelectedCustomerLest )

        }

    };
})();