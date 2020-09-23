(function () {
    'use strict';

    angular
        .module('pricerequest')
        .controller('RequestSendOffer', RequestSendOffer);

    /* @ngInject */
    function RequestSendOffer($mdToast, $mdDialog, triLoaderService, $http,ItemToEdit) {
        var vm = this;
        vm.requestPriceData = ItemToEdit;
        vm.requestPriceData.Weight.forEach(function(item, index){
            vm.requestPriceData.Product[index].Weight_Name = item.Weight_Name;
        });
        vm.requestPriceData.RequestPrice_Product.forEach(function(item, index){
            vm.requestPriceData.Product[index].Quantity_Required = item.Quantity_Required;
        });
        console.log(ItemToEdit);
        $http.get("http://35.246.143.96:3111/getCategories").then(function (data) {
            vm.Categorieslist = data.data;
        });

        $http.get("http://35.246.143.96:3111/getAllCustomer").then(function (response) {
            vm.selectedcustomeritem = null;
            vm.searchCustomerText = null;
            vm.queryCustomers = queryCustomers;
            vm.Customers = response.data;
            vm.Customerslist = response.data;
            vm.selectedCustomers = vm.requestPriceData.Customer;
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
        //vm.ProductRequests = vm.requestPriceData.Product;
        vm.DeleteProductoffer = function(ProductRequests){
            debugger;
            console.log(ProductRequests);
            vm.requestPriceData.Product.splice(vm.requestPriceData.Product.indexOf(ProductRequests), 1);
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
        

        vm.CloseSendOffer = function () {
            $mdDialog.hide();
        }
        vm.SubmitRequest = function () {
            triLoaderService.setLoaderActive(true);
            vm.productOffer = [];
            vm.requestPriceData.Product.forEach(function(product){
                var productOffer = {
                    Product_Name: product.Product_Name,
                    SendOffer_Amount: product.Quantity_Required,
                    Weight_Name: product.Weight_Name,
                    Product_ID: product.Product_Code,
                    Quantity_Required: product.Quantity_Required,
                    // Weight_ID:vm.requestPriceData.RequestPrice_Product[0].Weight_ID,
                    Price: product.SendOffer_Price,
                };
                vm.productOffer.push(
                    productOffer
                );
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
                }
            )
            vm.SendOffer.SendOffer_Create_Date = ChangeFormattedDate(vm.SendOffer.SendOffer_Create_Date);
            vm.SendOffer.SendOffer_Valid_Till = ChangeFormattedDate(vm.SendOffer.SendOffer_Valid_Till);
            vm.SendOffer.SendOffer_Product = vm.productOffer;
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
            console.log(vm.SendOffer);
            $http({
                method: "POST",
                url: 'http://35.246.143.96:3111/addSendOffer',
                data: vm.SendOffer
            }).then(function (data) {
                //vm.productOffers = []
                vm.productOffer = [];
                vm.selectedCustomer = null;
                vm.selectedCustomers = {};
                showAddToast('Request Added Successfully', $mdToast);
                triLoaderService.setLoaderActive(false);

            });

        }
    };
})();