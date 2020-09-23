(function() {
  "use strict";

  angular
    .module("managecustomers")
    .controller("ManageCustomerController", ManageCustomerController);

  /* @ngInject */
  function ManageCustomerController(
    $mdToast,
    UserService,
    triLoaderService,
    $http,
    $mdDialog
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.CustomerGrid = angular.element(document.querySelector("#jsGrid"));
    vm.isLoading = true;
    vm.alphabetArray = genCharArray("a", "z");
    function createJsGrid() {
      vm.isLoading = false;
      vm.CustomerGrid.jsGrid({
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
        data: vm.Customerslist,
        fields: [
          //copy Btt
          {
            title: "Copy",
            width: 10,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Customer_LinkedTo_Supplier_Code) {
                return $link;
              } else {
                var $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-copytosupplierbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "Copy Customer As Supplier")
                  .on("click", function() {
                    CopyCustomerAsSupplier(item);
                  });
              }

              return $link;
            }
          },
          //show Supplier Btt
          {
            title: "Link",
            width: 10,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Customer_LinkedTo_Supplier_Code) {
                var $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-linkedtosupplierbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "Customer Linked To Supplier")
                  .on("click", function() {
                    ShowSupplier(item.Customer_LinkedTo_Supplier_Code);
                  });
              } else {
                var $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-linkwithsupplierbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "Link Customer With Supplier")
                  .on("click", function() {
                    LinkCustomerWithSupplier(item);
                  });
              }

              return $link;
            }
          },
          {
            title: "Code",
            name: "Customer_Code",
            type: "number",
            width: 15
          },
          {
            title: "Name",
            name: "Customer_Name",
            type: "text",
            width: 90
          },
          {
            title: "Category",
            name: "Category",
            type: "text",
            width: 50,
            itemTemplate: function(value, item) {
              var valuetoshow = "";
              if (item.Customer_Category_IDs.length > 0)
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
            title: "Country",
            name: "country.Country_Name",
            type: "text",
            width: 40
          },
          {
            title: "Status",
            name: "Customer_IsActive",
            type: "checkbox",
            width: 15
          },
          //contact Btt
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
          }, //view customer products
          {
            title: "",
            width: 20,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  openProductToView(item);
                });
              return $link;
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
                  openCustomerDocuments(item);
                });
              return $link;
            }
          },
          // Edit Customer
          {
            title: "Edit",
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
                  openCustomerToEdit(item);
                });
              return $link;
            }
          },
          //Eissaa
          {
            title: "Quality",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Customer_IsChecked) {
                $link = $(
                  '<i class="zmdi zmdi-check-all rxp-green-icon">'
                ).attr("title", "customer Data Approved");
              } else {
                if (UserService.ifUserHasPermission("ApproveCustomerData")) {
                  $link = $("<button>")
                    .attr(
                      "class",
                      "md-primary  rxp-ingrid-btt rxp-ingrid-Checkbtt  md-button md-cyan-theme md-ink-ripple"
                    )
                    .text("")
                    .attr("title", "Approve Customer Data")
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
              if (item.Customer_IsChecked) {
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
          }, //Eissaa
          {
            title: "History",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link = "";
              if (UserService.ifUserHasPermission("ShowCustomerHistory")) {
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
    function openProductToView(itemToEdit) {
      $mdDialog.show({
        controller: "CustomersProductController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-customers/product-customers/product-customers.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          retriveCustomers();
        },
        locals: {
          Customer_Code: itemToEdit.Customer_Code,
          Customer_Name: itemToEdit.Customer_Name
        }
      });
    }

    function LinkCustomerWithSupplier(item) {
      $mdDialog.show({
        controller: "LinkWithSupplierController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-customers/link-with-supplier/link-with-supplier.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          vm.retriveCustomers(vm.selectedLetter);
        },
        locals: {
          Customer_Code: item.Customer_Code,
          Customer_Name: item.Customer_Name
        }
      });
    }
    function ShowSupplier(SupplierID) {
      alert("Customer is linked to Supplier Code: " + SupplierID);
    }
    function CopyCustomerAsSupplier(CustomerToCopy) {
      triLoaderService.setLoaderActive(true);
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/copyCustomerIntoSupplier",
        data: {
          Customer_Code: CustomerToCopy.Customer_Code,
          User_Code: vm.logedUser.id
        }
      }).then(function(data) {
        console.log(data);
        if (data.data == "Supplier Is Already Exist") {
          showAddErrorToast("Supplier Is Already Exist", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else if (data.data.message) {
          showAddToast("Supplier added successfully", $mdToast);
          vm.retriveCustomers(vm.selectedLetter);
          triLoaderService.setLoaderActive(false);
        } else if (data.data == "Customer Already Linked To Supplier") {
          showAddErrorToast("Customer Already Linked To Supplier", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else {
          showAddErrorToast("error", $mdToast);
          triLoaderService.setLoaderActive(false);
        }
      });
    }
    vm.retriveCustomers = function(Letter) {
      vm.isLoading = true;
      vm.selectedLetter = Letter;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllCustomersByUserCode", //http://35.246.143.96:3111
        data: { User_Code: vm.logedUser.id, letter: Letter }
      }).then(
        function(data) {
          vm.Customerslist = data.data;
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    };
    vm.retriveCustomers("A");

    //ASC order
    vm.ASC_Order =function (){
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrdergetAllCustomersByUserCode",
        data: { User_Code: vm.logedUser.id } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.Customerslist = data.data;
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
        url: "http://35.246.143.96:3111/DESCOrdergetAllCustomersByUserCode",
        data: { User_Code: vm.logedUser.id } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.Customerslist = data.data;
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function openContactForm(itemToEdit) {
      $mdDialog.show({
        controller: "CustomerContactController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-customers/customer-contacts/customer-contact.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          vm.retriveCustomers(vm.selectedLetter);
        },
        locals: {
          Customer_Code: itemToEdit.Customer_Code,
          Customer_Contact: itemToEdit.Customer_Contact,
          Customer_Name: itemToEdit.Customer_Name
        }
      });
    }
    function openCustomerDocuments(itemToViewItsDocuments){
      var item = {
        Customer_Code: itemToViewItsDocuments.Customer_Code,
        Customer_Name: itemToViewItsDocuments.Customer_Name
      };
      $mdDialog.show({
        controller: "ViewCustomerDocumentsController",
        controllerAs: "vm",
        templateUrl: "app/manage-customers/view-documents/view-documents.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          retriveCustomers();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }
    function openCustomerToEdit(itemToEdit) {
      $mdDialog.show({
        controller: "EditCustomerController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-customers/edit-customer/edit-customer.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          vm.retriveCustomers(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemToEdit
        }
      });
    }
    ///
    function showCheckWindow(itemToCheck) {
      $mdDialog.show({
        controller: "CheckCustomerController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-customers/check-customer/check-customer.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          vm.retriveCustomers(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemToCheck
        }
      });
    }
    function showDeclineCommentWindow(itemOfDeclineComment) {
      $mdDialog.show({
        controller: "DeclineCommentCustomerController",
        controllerAs: "vm",
        templateUrl: "app/manage-customers/decline-customer-comment/decline-customer-comment.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          vm.retriveCustomers(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemOfDeclineComment
        }
      });
    }

    function showHistory(itemToshowHistory) {
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getCustomerHistory",
        data: { Customer_Code: itemToshowHistory.Customer_Code }
      }).then(function(data) {
        console.log(data);
        if (!data.data.proceed) {
          showAddErrorToast("Error on retriving data!", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else {
          $mdDialog.show({
            controller: "ShowHistoryCustomerController",
            controllerAs: "vm",
            templateUrl:
              "app/manage-customers/show-history/show-history-customer.tmpl.html",
            clickOutsideToClose: false,
            focusOnOpen: false,
            //targetEvent: $event,
            onRemoving: function(event, removePromise) {
              vm.CustomerGrid.innerHTML = "";
              vm.retriveCustomers();
            },
            locals: {
              history: data.data.history //needs modification
            }
          });
        }
      });
    }
    vm.showAddWindow = function() {
      $mdDialog.show({
        controller: "AddCustomerController",
        controllerAs: "vm",
        templateUrl: "app/manage-customers/add-customer/add-customer.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.CustomerGrid.innerHTML = "";
          vm.retriveCustomers(vm.selectedLetter);
        }
      });
    };

    vm.SubmitSearch = function() {
      vm.isLoading = true;
      vm.CustomerSearch.type = "name";
       if (vm.selectSearchType == "Customer Code") {
        vm.CustomerSearch.type = "Customer Code";
      }
      vm.CustomerSearch.User_Code = vm.logedUser.id;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/searchCustomer",
        data:  vm.CustomerSearch
      }).then(function(data) {
        if (data.data.message == "No Data Found !!") {
          vm.Customerslist = [];
          vm.Customerslist = data.data;
          createJsGrid();
        } else {
          vm.Customerslist = data.data;
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
