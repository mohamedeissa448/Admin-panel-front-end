(function() {
  "use strict";

  angular
    .module("manage-bills")
    .controller("ManageSupplierBillsController", ManageSupplierBillsController);

  /* @ngInject */
  function ManageSupplierBillsController(UserService, $mdToast, triLoaderService,$filter,$http,$mdDialog) {
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

    vm.supplierBillGrid = angular.element(document.querySelector("#jsGrid"));

    function createJsGrid() {
      vm.supplierBillGrid.jsGrid({
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
        data: vm.supplierBillslist,
        fields: [
          {title: "Code",name: "Bill_Code",align: "center",type: "number",width: 15},
          {title: "Date",width: 40, align: "left",
            itemTemplate: function(value, item) {
              var billDateString = $filter("date")(
                item.Bill_Date,
                "dd MMM yyyy"
              );
              return billDateString;
            }
          },
          { title: "Supplier",name: "Bill_Supplier.Supplier_Name",align: "center", width: 140},
          { title: "Note",name: "Bill_Note",align: "center", width: 140},
          { title: "Done By",name: "Bill_DoneBy_User.User_Name",align: "center", width: 40},
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
                  showBillDetails(item);
                });
              return $link;
            }
        },
        ]
      });
    }

    function retriveSupplierBills() {
      $http({
        method: "get",
        url: "http://localhost:4000/supplier-bill/getAll",//35.246.143.96:3111
      }).then(function(data) {
        vm.supplierBillslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    retriveSupplierBills();


    vm.SubmitSearch = function() {
      vm.isLoading = true;
      var dataToSend = {};
      if(vm.selectedSuppliers.length > 0)
        dataToSend.Bill_Supplier = vm.selectedSuppliers[0]._id
      if(vm.Bill_Date)
        dataToSend.Bill_Date = vm.Bill_Date
      $http({
        method: "POST",
        url: "http://localhost:4000/supplier-bill/searchBills",
        data:  dataToSend
      }).then(function(data) {
        
          vm.supplierBillslist = data.data;
          createJsGrid();
        
      });
    };

    vm.showAddSupplierBill = function() {
      $mdDialog.show({
        controller: "AddSupplierBillController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-bills/manage-supplier-bills/add-supplier-bill/add-supplier-bill.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.supplierBillGrid.innerHTML = "";
          retriveSupplierBills();
        }
      });
    };


    function showBillDetails (itemToEdit) {
      $mdDialog.show({
        controller: "viewSupplierBillDetails",
        controllerAs: "vm",
        templateUrl:
          "app/manage-bills/manage-supplier-bills/view-supplier-bill/view-supplier-bill.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.supplierBillGrid.innerHTML = "";
          retriveSupplierBills();
        },
        locals: {
          id: itemToEdit._id
        }
      });
    }
  }
})();
