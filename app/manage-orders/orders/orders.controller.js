(function() {
  "use strict";

  angular
    .module("manageorders")
    .controller("ManageOrdersController", ManageOrdersController);

  /* @ngInject */
  function ManageOrdersController(UserService, $mdToast, triLoaderService,$filter,$http,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http.get("http://35.246.143.96:3111/getCustomer").then(function (response) {			   
            vm.selectedCustomerItem = null;
            vm.searchCustomerText = null;
            vm.queryCustomers = queryCustomers;
            vm.AllCustomers = response.data;
            vm.selectedCustomers = [];
            vm.transformChip = transformChip;   
            function queryCustomers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.AllCustomers.filter(function(customer) {
                    var lowercaseName = angular.lowercase(customer.Customer_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return customer;
                    }
                });
            }
            
    });

    vm.orderGrid = angular.element(document.querySelector("#jsGrid"));

    function createJsGrid() {
      vm.orderGrid.jsGrid({
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
        data: vm.orderslist,
        fields: [
          {title: "Code",name: "Order_Code",align: "center",type: "number",width: 15},
          {title: "Date",width: 40, align: "left",
            itemTemplate: function(value, item) {
              var orderDateString = $filter("date")(
                item.Order_Date,
                "dd MMM yyyy"
              );
              return orderDateString;
            }
          },
          { title: "Customer",name: "Order_Customer.Customer_Name",align: "center", width: 140},
          { title: "Note",name: "Order_Note",align: "center", width: 140},
          { title: "Done By",name: "Order_DoneBy_User.User_Name",align: "center", width: 50},
          { title: "Order Status",name: "Order_Status",align: "center", width: 40},
          { 
            title: "Edit" ,align: "center", width: 30,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Show Details")
                .text("")
                .on("click", function() {
                  editOrder(item);
                });
              return $link;
            }
        },
        ]
      });
    }

    function retriveOrders() {
      $http({
        method: "get",
        url: "http://localhost:4000/orders/getAll",//35.246.143.96:3111
      }).then(function(data) {
        vm.orderslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    retriveOrders();


    vm.SubmitSearch = function() {
      vm.isLoading = true;
      var dataToSend = {};
      if(vm.selectedCustomers.length > 0)
        dataToSend.Order_Customer = vm.selectedCustomers[0]._id
      if(vm.Order_Date)
        dataToSend.Order_Date = vm.Order_Date
      $http({
        method: "POST",
        url: "http://localhost:4000/orders/searchOrders",
        data:  dataToSend
      }).then(function(data) {
        
          vm.orderslist = data.data;
          createJsGrid();
        
      });
    };

    vm.showAddOrder = function() {
      $mdDialog.show({
        controller: "AddOrderController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-orders/orders/add-order/add-order.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.orderGrid.innerHTML = "";
          retriveOrders();
        }
      });
    };


    function editOrder (itemToEdit) {
      $mdDialog.show({
        controller: "EditOrderController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-orders/orders/edit-order/edit-order.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.orderGrid.innerHTML = "";
          retriveOrders();
        },
        locals: {
          orderId: itemToEdit._id
        }
      });
    }
  }
})();
