(function() {
  "use strict";

  angular
    .module("manageproduct")
    .controller("ManageProductController", ManageProductController);

  /* @ngInject */
  function ManageProductController(
    $mdDialog,
    $http,
    $state,
    triLoaderService,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.ProductGrid = angular.element(document.querySelector("#jsGrid"));
    var data = [];
    vm.alphabetArray = genCharArray("a", "z");

    function createJsGrid(data, fromsearch) {
      if (!fromsearch) {
        vm.Productslist = data.data;
      } else {
        vm.Productslist = data.data;
      }
      vm.ProductGrid.jsGrid({
        width: "100%",
        height: "90%",
        autoload: false,
        sorting: true,
        selecting: false,
        shrinkToFit: false,
        paging: true,
        inserting: false,
        editing: false,
        pageIndex: 1,
        pageSize: 20,
        pageButtonCount: 15,
        data: vm.Productslist,
        fields: [
          {
            title: "",
            width: 20,
            itemTemplate: function(value, item) {
              if (!item.Status) {
                if (UserService.checkIfHasPermission("deleteProduct")) {
                  var $link = $("<button>")
                    .attr(
                      "class",
                      "md-primary rxp-ingrid-btt rxp-ingrid-deletebtt  md-button md-cyan-theme md-ink-ripple"
                    )
                    .attr("title", "Delete")
                    .text("")
                    .on("click", function() {
                      DeleteProduct(item);
                    });
                  return $link;
                } else {
                  return "";
                }
              } else {
                return "";
              }
            }
          },
          { title: "Code", name: "Product_Code", type: "number", width: 35 },
          { title: "Name", name: "Product_Name", type: "text", width: 100 },
          {
            title: "Chemical Name",
            name: "Product_Chemical_Name",
            type: "text",
            width: 100
          },
          {
            title: "Abb.",
            name: "Product_Abbreviation",
            type: "text",
            width: 35
          },
          {
            title: "Manuf.",
            width: 50,
            itemTemplate: function(value, item) {
              if (item.Manufacturer )
                return item.Manufacturer.Supplier_Name;
              else {
                return "";
              }
            }
          },
          {
            title: "Active",
            name: "Product_IsActive",
            type: "checkbox",
            width: 40
          },
          {
            title: "",
            width: 20,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-supplierbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title", "Suppliers")
                .text("")
                .on("click", function() {
                  openSuppliersListToEdit(item);
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
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-customerbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title", "Customers")
                .text("")
                .on("click", function() {
                  openCustomerListToEdit(item);
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
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-copybtt  md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title", "Copy Product")
                .text("")
                .on("click", function() {
                  openProductToCopy(item);
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
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  openProductToEdit(item);
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
                .attr("title","Show Details")
                .text("")
                .on("click", function() {
                  openProductToView(item);
                });
              return $link;
            }
          },
          //Eissaa
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
                  openProductDocuments(item);
                });
              return $link;
            }
          },
          {
            title: "Quality",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Product_IsChecked) {
                $link = $(
                  '<i class="zmdi zmdi-check-all rxp-green-icon">'
                ).attr("title", "product Data Approved");
              } else {
                //if (UserService.ifUserHasPermission("ApproveProductData")) {
                $link = $("<button>")
                  .attr(
                    "class",
                    "md-primary  rxp-ingrid-btt rxp-ingrid-Checkbtt  md-button md-cyan-theme md-ink-ripple"
                  )
                  .text("")
                  .attr("title", "Approve Product Data")
                  .on("click", function() {
                    showCheckWindow(item);
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
            title: "Decline Comment",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if (item.Product_IsChecked) {
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
          {
            title: "History",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link = "";
              //if (UserService.ifUserHasPermission("ShowProductHistory")) {
              $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-historybtt  md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  showHistory(item);
                });
              // } else {
              //   $link = $('<i class="zmdi zmdi-block rxp-gray-icon"></i>');
              // }
              return $link;
            }
          }
        ]
      });
    }
    vm.retriveProducts = function(letter) {
      vm.selectedLetter = letter;
      $http({
        method: "post",
        url: "http://localhost:4000/getCustomeProductsFieldByUserCode",
        data: { User_Code: vm.logedUser.id, letter: letter } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          createJsGrid(data, false);
        },
        function(error) {
          console.log(error);
        }
      );
    };
    vm.retriveProducts("A");

    //ASC order
    vm.ASC_Order =function (){
      $http({
        method: "post",
        url: "http://localhost:4000/ASCOrdergetCustomeProductsFieldByUserCode",
        data: { User_Code: vm.logedUser.id } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          createJsGrid(data, false);
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
        url: "http://localhost:4000/DESCOrdergetCustomeProductsFieldByUserCode",
        data: { User_Code: vm.logedUser.id } // vm.logedUser.id }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          createJsGrid(data, false);
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function openSuppliersListToEdit(itemToEdit) {
      $mdDialog.show({
        controller: "ProductSupplierssController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-product/product-suppliers/product-suppliers.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,

        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          Product_Code: itemToEdit.Product_Code,
          Product_Name: itemToEdit.Product_Name
        }
      });
    }
    function openCustomerListToEdit(itemToEdit) {
      $mdDialog.show({
        controller: "ProductCustomersController",
        controllerAs: "vm",
        templateUrl:
          "app/manage-product/product-customers/product-customers.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          Product_Code: itemToEdit.Product_Code,
          Product_Name: itemToEdit.Product_Name
        }
      });
    }
    function openProductToCopy(itemToEdit) {
      var itemtoCopy = {
        Product_Code: itemToEdit.Product_Code,
        OldName: itemToEdit.Product_Name
      };
      $mdDialog.show({
        controller: "CopyProductController",
        controllerAs: "vm",
        templateUrl: "app/manage-product/copy-product/copy-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          itemDataToCopy: itemtoCopy
        }
      });
    }
    function openProductDocuments(itemToViewItsDocuments){
      var item = {
        Product_Code: itemToViewItsDocuments.Product_Code,
        Product_Name: itemToViewItsDocuments.Product_Name
      };
      $mdDialog.show({
        controller: "ViewProductDocumentsController",
        controllerAs: "vm",
        templateUrl: "app/manage-product/view-documents/view-documents.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }
    function openProductToView(itemToView) {
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getEncryptedID",
        data: { row_id: itemToView.Product_Code }
      }).then(function(data) {
        var url = $state.href("external.view-product", { pid: data.data });
        window.open(url, "_blank");
      });

      // $mdDialog.show({
      //     controller: 'ViewProductInternalController',
      //     controllerAs: 'vm',
      //     templateUrl: 'app/manage-product/view-product/view-product.tmpl.html',
      //     clickOutsideToClose: true,
      //     focusOnOpen: false,
      //     locals: {
      //         ProductToView: itemToView
      //     }
      // });
    }
    function openProductToEdit(itemToEdit) {
      $mdDialog.show({
        controller: "EditProductController",
        controllerAs: "vm",
        templateUrl: "app/manage-product/edit-product/edit-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          itemToEdit: itemToEdit
        }
      });
    }
    function DeleteProduct(item) {
      var Result;
      $mdDialog
        .show({
          multiple: true,
          skipHide: true,
          controllerAs: "confirmDialog",
          bindToController: true,
          controller: function($mdDialog) {
            var vmc = this;
            vmc.closeform = function closeform() {
              $mdDialog.hide();
              Result = true;
            };
            vmc.hide = function hide() {
              $mdDialog.hide();
              Result = false;
            };
          },
          template: GetConfirmDeleteProductTemplate(
            item.Product_Name + " - " + item.Product_Suffix
          )
        })
        .then(function() {
          if (Result) {
            Dodel(item);
          }
        });
    }
    function Dodel(item) {
      triLoaderService.setLoaderActive(true);
      var data = {};
      data.Product_Code = item.Product_Code;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/removeProduct",
        data: data
      }).then(function(data) {
        retriveProducts();
      });
    }
    ///
    function showCheckWindow(itemToCheck) {
      $mdDialog.show({
        controller: "CheckProductController",
        controllerAs: "vm",
        templateUrl: "app/manage-product/check-product/check-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          vm.retriveProducts(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemToCheck
        }
      });
    }

    function showDeclineCommentWindow(itemOfDeclineComment) {
      $mdDialog.show({
        controller: "DeclineCommentProductController",
        controllerAs: "vm",
        templateUrl: "app/manage-product/decline-product-comment/decline-product-comment.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          vm.retriveProducts(vm.selectedLetter);
        },
        locals: {
          ItemToEdit: itemOfDeclineComment
        }
      });
    }

    function showHistory(itemToshowHistory) {
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getProductHistory",
        data: { Product_Code: itemToshowHistory.Product_Code }
      }).then(function(data) {
        console.log(data);
        if (!data.data.proceed) {
          showAddErrorToast("Error on retriving data!", $mdToast);
          triLoaderService.setLoaderActive(false);
        } else {
          $mdDialog.show({
            controller: "ShowHistoryProductController",
            controllerAs: "vm",
            templateUrl:
              "app/manage-product/show-history/show-history-product.tmpl.html",
            clickOutsideToClose: false,
            focusOnOpen: false,
            //targetEvent: $event,
            onRemoving: function(event, removePromise) {
              vm.ProductGrid.innerHTML = "";
              vm.retriveProducts();
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
        controller: "AddProductController",
        controllerAs: "vm",
        templateUrl: "app/manage-product/add-product/add-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.ProductGrid.innerHTML = "";
          retriveProducts();
        }
      });
    };
    vm.SubmitSearch = function() {
      vm.ProductSearch.type = "name";
      if (vm.selectSearchType == "Chemical Name") {
        vm.ProductSearch.type = "Chemical Name";
      }
      else if (vm.selectSearchType == "Product Code") {
        vm.ProductSearch.type = "Product Code";
      }
      vm.ProductSearch.User_Code = vm.logedUser.id;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/searchProduct",
        data: vm.ProductSearch
      }).then(function(data) {
        if (data.data == "not Product") {
          vm.Productslist = [];
          createJsGrid(data, true);
        } else {
          createJsGrid(data, true);
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
