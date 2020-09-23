(function () {
    'use strict';

    angular
        .module('sendoffer')
        .controller('ManageSendOfferController', ManageSendOfferController);

    /* @ngInject */
    function ManageSendOfferController($mdToast, triLoaderService, $filter, $http, $mdDialog) {
        var vm = this;
        vm.RequestGrid = angular.element(document.querySelector('#jsGrid'));
        var data = [];

        function createJsGrid(data, fromsearch) {
            if (!fromsearch) {
                vm.RequestPriceList = data.data;
            } else {
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
                fields: [{
                        title: "Code",
                        name: "SendOffer_Code",
                        type: "number",
                        width: 15
                    },
                    {
                        title: "Date",
                        width: 40,
                        align: "left",
                        itemTemplate: function (value, item) {
                            var requestDateString = $filter('date')(item.SendOffer_Create_Date, "dd MMM yyyy");
                            return requestDateString;
                        }
                    },
                    {
                        title: "Title",
                        name: "SendOffer_Title",
                        type: "number",
                        width: 15
                    },
                    {
                        title: "",
                        width: 20,
                        align: "center",
                        itemTemplate: function (value, item) {
                            var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-customerbtt  md-button md-cyan-theme md-ink-ripple").text("")
                                .on("click", function () {
                                    opensendOfferToCustomers(item);
                                });
                            return $link;
                        }
                    },
                    {
                        title: "",
                        width: 20,
                        align: "center",
                        itemTemplate: function (value, item) {
                            var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-productbtt  md-button md-cyan-theme md-ink-ripple").text("")
                                .on("click", function () {
                                    SendOfferProducts(item);
                                });
                            return $link;
                        }
                    }
                ]
            });
        }

        function retriverequestPrices() {
            $http({
                method: "get",
                url: "http://35.246.143.96:3111/getAllSendOffer",
                data: data
            }).then(function (data) {
                createJsGrid(data, false);
            }, function (error) {
                console.log(error);
            });
        }
        retriverequestPrices();

        $http.get("http://35.246.143.96:3111/getAllSendOffer").then(function (data) {
            vm.SendOfferslist = data.data;
        });

        vm.searchForOffer = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vm.SendOfferslist.filter(function (Offer) {
                console.log(Offer.SendOffer_Title);
                if(Offer.SendOffer_Title != undefined){
                var lowercaseName = angular.lowercase(Offer.SendOffer_Title);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return Offer;
                }
            }
            });
            return results;
        };

        vm.SubmitSearch = function () {
            $http.get("http://35.246.143.96:3111/getAllSendOffer").then(function (data) {
                vm.CustomerSearch = vm.searchText;
                vm.RequestPriceList = data.data;
                vm.newRequestPriceList = [];
                console.log(vm.CustomerSearch);
                vm.RequestPriceList.forEach(
                    function (element) {
                        if (element.SendOffer_Title == undefined) {} else {
                            if (element.SendOffer_Title == vm.CustomerSearch) {
                                console.log(element);
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

        vm.showAddRequest = function () {
            $mdDialog.show({
                controller: 'AddSendOfferController',
                controllerAs: 'vm',
                templateUrl: 'app/send-offer/add-send-offer/add-send-offer.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.RequestGrid.innerHTML = "";
                    retriverequestPrices();
                }
            });
        }

        function opensendOfferToCustomers(itemToEdit) {
            $mdDialog.show({
                controller: 'ViewSendOffer',
                controllerAs: 'vm',
                templateUrl: 'app/send-offer/send-offer-customers/send-offer-customers.tmpl.html',
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

        function SendOfferProducts(itemToEdit) {
            $mdDialog.show({
                controller: 'SendOfferProducts',
                controllerAs: 'vm',
                templateUrl: 'app/send-offer/send-offer-products/send-offer-products.tmpl.html',
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