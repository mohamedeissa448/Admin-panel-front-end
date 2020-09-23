(function() {
  "use strict";

  angular
    .module("manage-bills")
    .controller("ManageSupplierReturnBillsController", ManageSupplierReturnBillsController);

  /* @ngInject */
  function ManageSupplierReturnBillsController(UserService, $mdToast, triLoaderService,$filter,$http,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http.get("http://35.246.143.96:3111/getSupplier").then(function (response) {			   
            vm.selectedSupplierItem = null;
            vm.searchSupplierText = null;
            vm.querySuppliers = querySuppliers;
            vm.AllSuppliers = response.data;
            vm.selectedSuppliers = [];
            vm.transformChip = transformChip;   
            function querySuppliers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.AllSuppliers.filter(function(suplier) {
                    var lowercaseName = angular.lowercase(suplier.Supplier_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return suplier;
                    }
                });
            }
            
    });

    vm.supplierReturnBillGrid = angular.element(document.querySelector("#jsGrid"));

    function createJsGrid() {
      vm.supplierReturnBillGrid.jsGrid({
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
        data: vm.supplierReturnBillslist,
        fields: [
          {title: "Code",name: "BillReturn_Code",align: "center",type: "number",width: 15},
          {title: "Date",width: 40, align: "left",
            itemTemplate: function(value, item) {
              var billDateString = $filter("date")(
                item.BillReturn_Date,
                "dd MMM yyyy"
              );
              return billDateString;
            }
          },
          { title: "Supplier",name: "Bill_Supplier.Supplier_Name",align: "center", width: 140},
          { title: "Note",name: "BillReturn_Note",align: "center", width: 140},
          { title: "Done By",name: "BillReturn_DoneBy_User.User_Name",align: "center", width: 40},
          { 
            title: "view" ,align: "center", width: 30,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Show Details")
                .text("")
                .on("click", function() {
                  showBillReturnDetails(item);
                });
              return $link;
            }
        },
        ]
      });
    }

    function retriveSupplierReturnBills() {
      $http({
        method: "get",
        url: "http://localhost:4000/supplier-return-bill/getAll",//35.246.143.96:3111
      }).then(function(data) {
        vm.supplierReturnBillslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    retriveSupplierReturnBills();


    vm.SubmitSearch = function() {
      vm.isLoading = true;
      var dataToSend = {};
      if(vm.selectedSuppliers.length > 0)
        dataToSend.Bill_Supplier = vm.selectedSuppliers[0]._id
      if(vm.BillReturn_Date)
        dataToSend.BillReturn_Date = vm.BillReturn_Date;
      $http({
        method: "POST",
        url: "http://localhost:4000/supplier-return-bill/searchBills",
        data:  dataToSend
      }).then(function(data) {
        
          vm.supplierReturnBillslist = data.data;
          createJsGrid();
        
      });
    };

    vm.showAddSupplierReturnBill = function() {
      $mdDialog.show({
        controller: "AddSupplierReturnBillController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-bills/manage-supplier-return-bills/add-supplier-return-bill/add-supplier-return-bill.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.supplierReturnBillGrid.innerHTML = "";
          retriveSupplierReturnBills();
        }
      });
    };


    function showBillReturnDetails (itemToEdit) {
      $mdDialog.show({
        controller: "viewSupplierReturnBillDetails",
        controllerAs: "vm",
        templateUrl:
          "app/manage-bills/manage-supplier-return-bills/view-supplier-return-bill/view-supplier-return-bill.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.supplierReturnBillGrid.innerHTML = "";
          retriveSupplierReturnBills();
        },
        locals: {
          id: itemToEdit._id
        }
      });
    }
  }
})();
