(function() {
  "use strict";

  angular
    .module("customerorder")
    .controller("ManageCustomerOrderController", ManageCustomerOrderController);

  /* @ngInject */
  function ManageCustomerOrderController(UserService, $mdToast, triLoaderService,$filter,$http,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.RequestGrid = angular.element(document.querySelector("#jsGrid"));

    function createJsGrid() {
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
        data: vm.SendOfferslist,
        fields: [
          {title: "Code",name: "CustomerOrder_Code",align: "center",type: "number",width: 15},
          {title: "Date",width: 40, align: "left",
            itemTemplate: function(value, item) {
              var requestDateString = $filter("date")(
                item.CustomerOrder_Date,
                "dd MMM yyyy"
              );
              return requestDateString;
            }
          },
          { title: "Customer(s)",align: "left", width: 140,
            itemTemplate: function(value, item) {
              var valuetoshow = "";
              item.CustomerOrder_Customer.forEach(function(part, index, customer) {
                valuetoshow =
                  valuetoshow +
                  '<span class="rxp-ingrid-chips">' +
                  customer[index].Customer_Name +
                  "</span>";
              });
              return valuetoshow;
            }
          },
          {title: "",width: 20, align: "center",
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-productbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  OpenOrderProducts(item);
                });
              return $link;
            }
          }
        ]
      });
    }

    function retriveCustomerOrders() {
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getCustomerOrdersByUserId",//35.246.143.96:3111
        data: {user_id: vm.CurrentUser.mongoID }
      }).then(function(data) {
        vm.SendOfferslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    retriveCustomerOrders();

    vm.searchForOffer = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      var results = vm.SendOfferslist.filter(function(Offer) {
        console.log(Offer.SendOffer_Title);
        if (Offer.SendOffer_Title != undefined) {
          var lowercaseName = angular.lowercase(Offer.SendOffer_Title);
          if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
            return Offer;
          }
        }
      });
      return results;
    };

    vm.SubmitSearch = function() {
      $http
        .get("http://35.246.143.96:3111/getAllSendOffer")
        .then(function(data) {
          vm.CustomerSearch = vm.searchText;
          vm.RequestPriceList = data.data;
          vm.newRequestPriceList = [];
          console.log(vm.CustomerSearch);
          vm.RequestPriceList.forEach(function(element) {
            if (element.SendOffer_Title == undefined) {
            } else {
              if (element.SendOffer_Title == vm.CustomerSearch) {
                console.log(element);
                vm.newRequestPriceList.push(element);
              }
            }
          });
          data.data = vm.newRequestPriceList;
          if (vm.searchText == "") {
            data.data = vm.RequestPriceList;
          }
          createJsGrid(data, true);
        });
    };

    vm.showAddRequest = function() {
      $mdDialog.show({
        controller: "AddCustomerOrderController",
        controllerAs: "vm",
        templateUrl:
          "app/customer-order/add-customer-order/add-customer-order.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.RequestGrid.innerHTML = "";
          retriveCustomerOrders();
        }
      });
    };

    function OpenOrderProducts(itemToEdit) {
      $mdDialog.show({
        controller: "viewCustomerOrderProducts",
        controllerAs: "vm",
        templateUrl:
          "app/customer-order/view-customer-order-products/view-customer-order-products.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.RequestGrid.innerHTML = "";
          retriveCustomerOrders();
        },
        locals: {
          ItemToEdit: itemToEdit
        }
      });
    }
  }
})();
