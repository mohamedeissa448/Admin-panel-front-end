(function() {
  "use strict";

  angular
    .module("managesuppliers")
    .controller("ManagesuppliersController", ManagesuppliersController);

  /* @ngInject */
  function ManagesuppliersController(
    $mdToast,
    UserService,
    triLoaderService,
    $http,
    $mdDialog
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.logedUser = UserService.getCurrentUser();
    vm.SupplierGrid = angular.element(document.querySelector("#jsGrid"));
    var data = [];
    vm.alphabetArray = genCharArray("a", "z");
    function createJsGrid() {
      vm.isLoading = false;
      vm.SupplierGrid.jsGrid({
        width: "1400",
        height: "65vh",
        autoload: false,
        sorting: true,
        selecting: false,
        paging: true,
        inserting: false,
        editing: false,
        pageIndex: 1,
        pageSize: 20,
        pageButtonCount: 15,
        data: vm.Supplierslist,
        fields: [
          //copy btt
          {
            title: "Copy",
            width: 15,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Supplier_LinkedTo_Customer_Code) {
                var $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-linkedtosupplierbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "Supplier Linked To Customer")
                  .on("click", function() {
                    ShowCustomer(item.Supplier_LinkedTo_Customer_Code);
                  });
              } else {
                var $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-copytocustomerbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "Copy Supplier As Customer")
                  .on("click", function() {
                    CopySupplierAsCustomer(item);
                  });
              }

              return $link;
            }
          },
          {
            title: "Code",
            name: "Supplier_Code",
            type: "number",
            width: 15
          },
          {
            title: "Name",
            name: "Supplier_Name",
            type: "text",
            width: 90
          },
          {
            title: "Category",
            name: "Category",
            type: "text",
            width: 120,
            itemTemplate: function(value, item) {
              var valuetoshow = "";
              if (item.Supplier_Category_IDs.length > 0)
                value.forEach(function(part, index, cat) {
                  valuetoshow =
                    valuetoshow +
                    '<span class="rxp-ingrid-chips">' +
                    cat[index].Category_Name +
                    "</span>";
                });
              return valuetoshow;
            }
          },
          {
            title: "",
            width: 20,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Documents")
                .text("")
                .on("click", function() {
                  openSuppilerDocuments(item);
                });
              return $link;
            }
          },
          {
            title: "Country",
            name: "country.Country_Name",
            type: "text",
            align: "center",
            width: 30
          },
          {
            title: "Supp.",
            name: "Supplier_IsSupplier",
            type: "checkbox",
            width: 20
          },
          {
            title: "Manuf.",
            name: "Supplier_IsManufacturer",
            type: "checkbox",
            width: 20
          },
          {
            title: "Status",
            name: "Supplier_IsActive",
            type: "checkbox",
            width: 20
          },
          //view supplier products
          {
            title: "",
            width: 20,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple",
                  "title",
                  "supplier's products"
                )
                .text("")
                .on("click", function() {
                  openProductToView(item);
                });
              return $link;
            }
          },
          //contact btt
          {
            title: "",
            width: 10,
            align: "center",
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary  rxp-ingrid-btt rxp-ingrid-contactbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  openContactForm(item);
                });
              return $link;
            }
          },
          //edit btt
          {
            title: "",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  openSupplierToEdit(item);
                });
              return $link;
            }
          },

          //Quality Btt
          {
            title: "Quality",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Supplier_IsChecked) {
                var $link = $(
                  '<i class="zmdi zmdi-check-all rxp-green-icon">'
                ).attr("title", "Supplier Data Approved");
              } else {
                if (UserService.ifUserHasPermission("ApproveSupplierData")) {
                  var $link = $("<button>")
                    .attr(
                      "class",
                      "md-primary  rxp-ingrid-btt rxp-ingrid-Checkbtt  md-button md-cyan-theme md-ink-ripple"
                    )
                    .text("")
                    .attr("title", "Approve Supplier Data")
                    .on("click", function() {
                      showCheckWindow(item);
                    });
                } else {
                  $link = $(
                    '<i class="zmdi zmdi-hourglass-alt rxp-orange-icon"></i>'
                  );
                }
              }
              return $link;
            }
          }, //Eissaa
          {
            title: "Decline Comment",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Supplier_IsChecked) {
                $link = $(
                  '<i class="zmdi zmdi-check-all rxp-green-icon">'
                ).attr("title", "No Comment");
              } else {
                //if (UserService.ifUserHasPermission("ApproveProductData")) {
                $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-Checkbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "show Decline Comment")
                  .on("click", function() {
                    showDeclineCommentWindow(item);
                  });
                // } else {
                //   $link = $(
                //     '<i class="zmdi zmdi-hourglass-alt rxp-orange-icon"></i>'
                //   );
                //}
              }

              return $link;
            }
          },
          //History Btt
          {
            title: "History",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link = "";
              if (UserService.ifUserHasPermission("ShowSupplierHistory")) {
                $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary md-raised rxp-ingrid-btt rxp-ingrid-historybtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .on("click", function() {
                    showHistory(item);
                  });
              } else {
                $link = $('<i class="zmdi zmdi-block rxp-gray-icon"></i>');
              }
              return $link;
            }
          }
        ]
      });
    }
    function openSuppilerDocuments(itemToViewItsDocuments){
      var item = {
        Supplier_Code: itemToViewItsDocuments.Supplier_Code,
        Supplier_Name: itemToViewItsDocuments.Supplier_Name
      };
      $mdDialog.show({
        controller: "ViewSupplierDocumentsController",
        controllerAs: "vm",
        templateUrl: "app/manage-suppliers/view-documents/view-documents.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          retriveSuppliers();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }
    function openProductToView(itemToEdit) {
      $mdDialog.show({
        controller: "ProductSuppliersController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-suppliers/product-suppliers/product-suppliers.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          retriveSuppliers();
        },
        locals: {
          Supplier_Code: itemToEdit.Supplier_Code,
          Supplier_Name: itemToEdit.Supplier_Name
        }
      });
    }
    function ShowCustomer(CustomerID) {
      alert("Supplier is linked to Customer Code: " + CustomerID);
    }
    function CopySupplierAsCustomer(SupplierToCopy) {
      triLoaderService.setLoaderActive(true);
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/copySupplierIntoCustomer",
        data: {
          Supplier_Code: SupplierToCopy.Supplier_Code,
          User_Code: vm.logedUser.id
        }
      }).then(function(data) {
        console.log(data);
        if (data.data == "Customer Is Already Exist") {
          showAddErrorToast("Customer Is Already Exist", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else if (data.data.message) {
          showAddToast("Customer added successfully", $mdToast);
          vm.retriveSuppliers(vm.selectedLetter);
          triLoaderService.setLoaderActive(false);
        } else if (data.data == "Supplier Already Linked To Customer") {
          showAddErrorToast("Supplier Already Linked To Customer", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else {
          showAddErrorToast("error", $mdToast);
          triLoaderService.setLoaderActive(false);
        }
      });
    }
    vm.retriveSuppliers = function(Letter) {
      vm.selectedLetter = Letter;
      vm.isLoading = true;
      $http({
        method: "post", //test commit
        url: "http://35.246.143.96:3111/getAllSupplierByUserCode",
        data: {
          User_Code: vm.logedUser.id,
          letter: Letter
        }
      }).then(
        function(data) {
          console.log(data);
          vm.Supplierslist = data.data;
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    };
    vm.retriveSuppliers("A");

    //ASC order
    vm.ASC_Order =function (){
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrdergetAllSupplierByUserCode",
        data: { User_Code: vm.logedUser.id } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.Supplierslist = data.data;
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }
    //DESC order
    vm.DESC_Order =function (){
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/DESCOrdergetAllSupplierByUserCode",
        data: { User_Code: vm.logedUser.id } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.Supplierslist = data.data;
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function openContactForm(itemToEdit) {
      $mdDialog.show({
        controller: "SupplierContactController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-suppliers/supplier-contact/supplier-contact.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          vm.retriveSuppliers(vm.selectedLetter);
        },
        locals: {
          Supplier_Code: itemToEdit.Supplier_Code,
          Supplier_Name: itemToEdit.Supplier_Name
        }
      });
    }

    function openSupplierToEdit(itemToEdit) {
      console.log(itemToEdit);
      $mdDialog.show({
        controller: "EditSupplierController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-suppliers/edit-supplier/edit-supplier.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          vm.retriveSuppliers(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemToEdit
        }
      });
    }

    function showCheckWindow(itemToCheck) {
      console.log("showed");
      $mdDialog.show({
        controller: "CheckSupplierController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-suppliers/check-supplier/check-supplier.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          vm.retriveSuppliers(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemToCheck
        }
      });
    }

    function showDeclineCommentWindow(itemOfDeclineComment) {
      $mdDialog.show({
        controller: "DeclineCommentSupplierController",
        controllerAs: "vm",
        templateUrl: "app/manage-suppliers/decline-supplier-comment/decline-supplier-comment.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          vm.retriveSuppliers(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemOfDeclineComment
        }
      });
    }

    function showHistory(itemToshowHistory) {
      console.log("history");
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getSupplierHistory",
        data: { Supplier_Code: itemToshowHistory.Supplier_Code }
      }).then(function(data) {
        console.log(data);
        if (data.data == "No history is Found!") {
          showAddErrorToast("No history is Found!", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else if (data.data.history) {
          $mdDialog.show({
            controller: "ShowHistorySupplierController",
            controllerAs: "vm",
            templateUrl:
              "app/manage-suppliers/show-history/show-history-supplier.tmpl.html",
            clickOutsideToClose: false,
            focusOnOpen: false,
            //targetEvent: $event,
            onRemoving: function(event, removePromise) {
              //vm.CustomerGrid.innerHTML = "";
              //retriveCustomers();
            },
            locals: {
              history: data.data.history //needs modification
            }
          });
        } else {
          showAddErrorToast("No history Found!", $mdToast);
          triLoaderService.setLoaderActive(false);
        }
      });
    }
    vm.showAddWindow = function() {
      $mdDialog.show({
        controller: "AddSupplierController",
        controllerAs: "vm",
        templateUrl: "app/manage-suppliers/add-supplier/add-supplier.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.SupplierGrid.innerHTML = "";
          vm.retriveSuppliers(vm.selectedLetter);
        }
      });
    };
    vm.SubmitSearch = function() {
     /* vm.searchSupplier.type = "supplier";
      if (vm.selectSearchType == "Manufacturer") {
        vm.searchSupplier.type = "";
      }
      vm.searchSupplier.User_Code = vm.logedUser.id;*/

      vm.searchSupplier.type = "supplier";
      if (vm.selectSearchType == "Manufacturer") {
        vm.searchSupplier.type = "Manufacturer";
      }
      else if (vm.selectSearchType == "Supplier Code") {
        vm.searchSupplier.type = "Supplier Code";
      }
      vm.searchSupplier.User_Code = vm.logedUser.id;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/searchSupplier",
        data: vm.searchSupplier
      }).then(function(data) {
        if (data.data.length == 0) {
          vm.Supplierslist = [];
          createJsGrid();
        } else {
          vm.Supplierslist = data.data;
          createJsGrid();
        }
      });
    };
  }
})();
function checkedFilter(btt) {
  clearCheckedLetter();
  btt.classList.add("rxp-checked-letter");
}
function clearCheckedLetter() {
  var unselectedBtt = document.getElementsByClassName("rxp-checked-letter");
  if (unselectedBtt[0]) unselectedBtt[0].classList.remove("rxp-checked-letter");
}
