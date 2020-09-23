(function() {
    'use strict';

    angular
        .module('pricerequest')
        .controller('ManagePriceRequestController', ManagePriceRequestController);

    /* @ngInject */
    function ManagePriceRequestController($mdToast, triLoaderService,$filter,$http,$mdDialog) {
        var vm = this;
        vm.RequestGrid = angular.element( document.querySelector( '#jsGrid' ) );
        var data = [];
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.RequestPriceList = data.data;
            }
            else{
                vm.RequestPriceList = data.data;
            }
            vm.RequestGrid.jsGrid({
                width: "100%",
                height: "70vh",
                autoload: false,
                sorting: true,
                selecting: false,
                paging: true,
                inserting: false,
                editing: false,
                pageIndex: 1,
                pageSize: 20,
                pageButtonCount: 15,
                data: vm.RequestPriceList,
                fields: [
                    { title: "Code", name: "RequestPrice_Code", type: "number", width: 15},
                    { title: "Date",  width: 40, align: "left",
                    itemTemplate: function(value, item) {
                        var requestDateString  = $filter('date')(item.RequestPrice_Create_Date, "dd MMM yyyy");
                        return requestDateString;
                    }},
                    { title: "Customer", name: "Customer", type: "text", width: 50,
                        itemTemplate: function(value, item) {
                            var valuetoshow = '';
                            value.forEach(function(part, index, Customer) {
                                valuetoshow = valuetoshow + '<span>'+Customer[index].Customer_Name+'</span>';
                            })
                            return valuetoshow
                        }
                    },
                    { title: "Customer Offer",  width: 20, align: "center" ,
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-sendbtt md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openRequestSendOffer(item);
                        }) ;
                        return $link;
                    }},
                    { title: "Product",  width: 20, align: "center" ,
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-productbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openrequestPriceToProduct(item);
                        }) ;
                        return $link;
                    }},
                    { title: "View Suppliers",  width: 20, align: "center" ,
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-supplierbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openrequestPriceToSupliers(item);
                        }) ;
                        return $link;
                    }}
                ]
            });
        }
        function retriverequestPrices(){
            $http({
                method:"get",
                url:"http://35.246.143.96:3111/getAllRequestPrice",
                data :data
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        retriverequestPrices();
        
        $http.get("http://35.246.143.96:3111/getAllCustomer").then(function (data) {
            vm.Customerslist = data.data;
        });

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

        vm.SubmitSearch = function () {
            $http.get("http://35.246.143.96:3111/getAllRequestPrice").then(function (data) {
                vm.CustomerSearch = vm.searchText;
                vm.RequestPriceList = data.data;
                vm.newRequestPriceList = [];
                vm.RequestPriceList.forEach(
                    function (element) {
                        if (element.Customer[0] == undefined) {} else {
                            if (element.Customer[0].Customer_Name == vm.CustomerSearch) {
                                vm.newRequestPriceList.push(element);
                            }
                        }
                    }
                );
                data.data = vm.newRequestPriceList;
                if (vm.searchText == "") {
                    data.data = vm.RequestPriceList;
                }
                createJsGrid(data, true);
            });
        }
        
        vm.showAddRequest = function(){
            $mdDialog.show({
                controller: 'AddPriceRequestController',
                controllerAs: 'vm',
                templateUrl: 'app/price-request/add-price-request/add-price-request.tmpl.html',
                clickOutsideToClose: false,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.RequestGrid.innerHTML = "";
                    retriverequestPrices();
                }
            });
        }

        function openrequestPriceToSupliers(itemToEdit){
            $mdDialog.show({
                controller: 'ViewPriceRequest',
                controllerAs: 'vm',
                templateUrl: 'app/price-request/view-price-request/view-price-request.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.requestPriceGrid.innerHTML = "";
                    retriverequestPrices();
                },
                locals: {
                    ItemToEdit: itemToEdit,
                }
            });      
        }

        function openrequestPriceToProduct(itemToEdit){
            $mdDialog.show({
                controller: 'viewPriceRequestProduct',
                controllerAs: 'vm',
                templateUrl: 'app/price-request/view-price-request-product/view-price-request-product.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.requestPriceGrid.innerHTML = "";
                    retriverequestPrices();
                },
                locals: {
                    ItemToEdit: itemToEdit,
                }
            });
            
        }

        function openRequestSendOffer(itemToEdit){
            $mdDialog.show({
                controller: 'RequestSendOffer',
                controllerAs: 'vm',
                templateUrl: 'app/price-request/price-request-send-offer/price-request-send-offer.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.requestPriceGrid.innerHTML = "";
                    retriverequestPrices();
                },
                locals: {
                    ItemToEdit: itemToEdit,
                }
            });
            
        }
    }
})();