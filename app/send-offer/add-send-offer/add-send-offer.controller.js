(function () {
    'use strict';

    angular
        .module('sendoffer')
        .controller('AddSendOfferController', AddSendOfferController);

    /* @ngInject */
    function AddSendOfferController($mdToast, $mdDialog, triLoaderService, $http) {
        var vm = this;

        $http.get("http://35.246.143.96:3111/getCategories").then(function (data) {
            vm.Categorieslist = data.data;
        });

        $http.get("http://35.246.143.96:3111/getAllCustomer").then(function (response) {
            vm.selectedcustomeritem = null;
            vm.searchCustomerText = null;
            vm.queryCustomers = queryCustomers;
            vm.Customers = response.data;
            vm.Customerslist = response.data;
            vm.selectedCustomers = [];
            vm.transformChip = transformChip;

            function queryCustomers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.Customers.filter(function (Customer) {
                    var lowercaseName = angular.lowercase(Customer.Customer_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return Customer;
                    }
                });
            }
        });

        $http.get("http://35.246.143.96:3111/getCategories").then(function (data) {
            vm.CatigoryList = data.data;
        });

        function transformChip(chip) {
            if (angular.isObject(chip)) {
                return chip;
            } else {
                return null;
            }
        }

        $http({
            method: "get",
            url: "http://35.246.143.96:3111/getProducts",
            data: {}
        }).then(function (data) {
            vm.Productslist = data.data;
        })

        $http.get("http://35.246.143.96:3111/getWeight").then(function (data) {
            vm.WeightUnitsList = data.data;
        });

        vm.productOffers = [];
        vm.productOffer = [];
        vm.AddproductOffer = function () {
            if (!vm.selectedProduct || vm.SendOffer_Amount == undefined || vm.SendOffer_Units == undefined) {
                showAddErrorToast('You must Fill all product data', $mdToast);
            } else {
                var productOffer = {
                    Product_Name: vm.selectedProduct.Product_Name,
                    SendOffer_Amount: vm.SendOffer_Amount,
                    Weight_Name: vm.SendOffer_Units.Weight_Name,
                    Product_ID: vm.selectedProduct.Product_Code,
                    Quantity_Required: vm.SendOffer_Amount,
                    Weight_ID: vm.SendOffer_Units.Weight_Code,
                    Price: vm.SendOffer_Price,
                };

                vm.productOffers.push(
                    productOffer
                );
                console.log(productOffer);

                vm.selectedProduct = null;
                vm.SendOffer_Amount = '';
                vm.SendOffer_Units = '';
                vm.SendOffer_Price = '';
            }
        };

        vm.FilterCustomerByProduct = function () {
            $mdDialog.show({
                multiple: true,
                skipHide: true,
                controller: 'GetCustomersByProductController',
                controllerAs: 'vmr',
                templateUrl: 'app/send-offer/add-send-offer/get-customer-by-product.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                locals: {
                    productlist: vm.Productslist
                },
                //targetEvent: $event,
                // onRemoving: function (event, removePromise) {
                //     vm.RequestGrid.innerHTML = "";
                // }
            }).then(function (listOfSelectedCustomers) {
                console.log(listOfSelectedCustomers);
                console.log(vm.selectedCustomers);

                vm.selectedCustomers = listOfSelectedCustomers;
                console.log(vm.selectedCustomers);
            }, function () {
                console.log('You cancelled the dialog.');
            });
        }

        vm.DeleteRequest = function (productOffers) {
            vm.productOffers.splice(vm.productOffers.indexOf(productOffers), 1);
        };

        vm.searchForCustomer = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vm.Customerslist.filter(function (customer) {
                var lowercaseName = angular.lowercase(customer.Customer_Name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return customer;
                }
            });
            return results;
        };

        vm.searchForproduct = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vm.Productslist.filter(function (product) {
                var lowercaseName = angular.lowercase(product.Product_Name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return product;
                }
            });
            return results;
        };

        vm.CloseSendOffer = function () {
            $mdDialog.hide();
        }
        vm.SubmitRequest = function () {
            triLoaderService.setLoaderActive(true);
            var ProductToSend = [];
            angular.copy(vm.productOffers, ProductToSend);
            ProductToSend.forEach(function (v) {
                delete v.SendOffer_Amount
            });
            var Price_Status = 0;
            vm.selectedCustomersoffer = [];
            vm.selectedCustomers.forEach(
                function (element) {
                    var objectSelectedCustomers = {};
                    objectSelectedCustomers.Customer_ID = element.Customer_Code;
                    objectSelectedCustomers.Customer_Email = element.Customer_Email;
                    objectSelectedCustomers.Price_Status = Price_Status;
                    vm.selectedCustomersoffer.push(objectSelectedCustomers);
                })

            vm.SendOffer.SendOffer_Product = ProductToSend;
            vm.SendOffer.SendOffer_Customer = vm.selectedCustomersoffer;

            if (vm.selectCustomerType == 'Customers') {
                vm.SendOffer.Category_ID = undefined;
            }
            if (vm.selectCustomerType == 'Categories') {
                vm.SendOffer.SendOffer_Customer = [];
            };
            if (vm.SendOffer.SendOffer_Product.length == 0) {
                showAddErrorToast('you must add one product at least', $mdToast);
            };
            vm.SendOffer.SendOffer_Customer_ID = vm.selectedCustomersoffer.Customer_Code;
            vm.SendOffer.SendOffer_Valid_Till =  ChangeFormattedDate(vm.SendOffer.SendOffer_Valid_Till);
            vm.SendOffer.SendOffer_Create_Date =  ChangeFormattedDate(vm.SendOffer.SendOffer_Create_Date);
            console.log(vm.SendOffer);
            $http({
                method: "POST",
                url: 'http://35.246.143.96:3111/addSendOffer',
                data: vm.SendOffer
            }).then(function (data) {
                vm.productOffers = []
                vm.productOffer = [];
                vm.selectedCustomer = null;
                vm.selectedCustomers = {};
                showAddToast('Request Added Successfully', $mdToast);
                triLoaderService.setLoaderActive(false);

            });

        }
    };
})();