(function() {
  "use strict";

  angular
    .module("stores")
    .controller("ManageStoresController", ManageStoresController);

  /* @ngInject */
  function ManageStoresController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.storeProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");

    function createJsGrid() {
      vm.storeProductGrid.jsGrid({
        width: "1400",
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
        data: vm.storeProductslist,
        fields: [
          {title: "Product Code",name: "Product_Code",align: "center",type: "number",width: 30},
          {
            title: "Product Name",
            name: "Product_Name",
            type: "text",
            width: 80
          },
          {title: "Supplier Code",name: "Supplier_Code",align: "center",type: "number",width: 30},
          {
            title: "Supplier Name",
            name: "Supplier_Name",
            type: "text",
            width: 80,
            align: "center"
          },
          {
            title: "Product BatchNumber",
            name: "Product_BatchNumber",
            type: "text",
            width: 50,
            align: "center"
          },
          {
            title: "Origin Country",
            type: "text",
            width: 30,
            align: "center",
            itemTemplate: function(value, item) {
              if(item.country)
              return item.country.Country_Name;
            }
          },
          {
            title: "Production Date",
            type: "text",
            width: 50,
            align: "center",
            itemTemplate: function(value, item) {
              if (!String.prototype.format) {
                String.prototype.format = function() {
                  return this.replace(/(\{\d+\})/g, function(a) {
                    return args[+(a.substr(1, a.length - 2)) || 0];
                  });
                };
              }
              var todayTime = new Date(item.purchasing.Product_Date_Of_Production);
              console.log('todayTime',todayTime)
              var month = todayTime.getMonth() + 1
              var day = todayTime.getDate();
              var year = todayTime.getFullYear();
              console.log('month',month)

              return day + "/" + month + "/" + year;
            }
          },
          {
            title: "Expiration Date",
            type: "text",
            width: 50,
            align: "center",
            itemTemplate: function(value, item) {
              if (!String.prototype.format) {
                String.prototype.format = function() {
                  return this.replace(/(\{\d+\})/g, function(a) {
                    return args[+(a.substr(1, a.length - 2)) || 0];
                  });
                };
              }
              var todayTime = new Date(item.Product_Date_Of_Expiration);
              console.log('todayTime',todayTime)
              var month = todayTime.getMonth() + 1
              var day = todayTime.getDate();
              var year = todayTime.getFullYear();
              console.log('month',month)

              return day + "/" + month + "/" + year;
            }
          },
          {
            title: "Current Number Of Packages",//الموجوده حاليا في المخزن
            type: "text",
            width: 40,
            align: "center",
            itemTemplate: function(value, item) {
              var current_num_of_packages = item.Product_Current_Quantity / item.purchasing.Product_Package_Weight
              return current_num_of_packages.toFixed(2) ;
            }
          },
          {
            title: "Weight Of Package",
            type: "text",
            width: 40,
            align: "center",
            itemTemplate: function(value, item) {
              if(item.purchasing)
              return item.purchasing.Product_Package_Weight .toFixed(2)   ;
              return ""   
            }
          },
          {
            title: "Current Quantity",
            type: "text",
            width: 50,
            align: "center",
            itemTemplate: function(value, item) {
              if(item.Product_Current_Quantity)
              return item.Product_Current_Quantity.toFixed(2);
              else return "";    
            }
          },
          // Edit product of store
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
                  openStoreProductToEdit(item);
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
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-productbtt  md-button md-cyan-theme md-ink-ripple"
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
            title: "",
            width: 20,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-productbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Output")
                .text("")
                .on("click", function() {
                  Output(item);
                });
              return $link;
            }
          },
        ]
      });
    }

    vm.retriveStoreProducts= function(letter) {
      var dataTosend ={ letter: letter,filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In Stores=>Store 1.User can see all store products'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllStoreProducts",//35.246.143.96:3111
        data: dataTosend
      }).then(function(data) {
        vm.storeProductslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retriveStoreProducts();

    //ASC order
    vm.ASC_Order =function (){
      var dataTosend ={ filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In Stores=>Store 1.User can see all store products'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrderGetAllStoreProducts",
        data: dataTosend 
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.storeProductslist = data.data
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }
    //DESC order
    vm.DESC_Order =function (){
      var dataTosend ={ filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In Stores=>Store 1.User can see all store products'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;

      $http({
        method: "post",
        url: "http://35.246.143.96:3111/DESCOrderGetAllStoreProducts",
        data: dataTosend
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.storeProductslist = data.data
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    vm.SubmitSearch = function() {
      vm.isLoading = true;
      vm.search={}
       if (vm.selectSearchType == "Product_Name") {
        vm.search.Product_Name = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Code") {
        vm.search.Product_Code = vm.PurchasingSearch;
      }else if (vm.selectSearchType == "Supplier_Name") {
        vm.search.Supplier_Name = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Supplier_Code") {
        vm.search.Supplier_Code = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_BatchNumber") {
        vm.search.Product_BatchNumber = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Storing_Date") {
        vm.search.Product_Storing_Date = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Date_Of_Expiration") {
        vm.search.Product_Date_Of_Expiration = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Incoming_Bill_Number") {
        vm.search.Product_Incoming_Bill_Number = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Incoming_Supplier_Permission_Number") {
        vm.search.Product_Incoming_Supplier_Permission_Number = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Incoming_HighChem_Permission_Number") {
        vm.search.Product_Incoming_HighChem_Permission_Number = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Number_Of_Packages") {
        vm.search.Product_Number_Of_Packages = vm.PurchasingSearch;
      }
      //vm.search.StoreProduct_CreatedByUser = vm.CurrentUser.mongoID;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/searchStore",
        data:  vm.search
      }).then(function(data) {
        if (data.data.message == "No Data Found !!") {
        vm.storeProductslist = data.data
          createJsGrid();
        } else {
        vm.storeProductslist = data.data
          createJsGrid();
        }
      });
    };

    vm.showAddRequest = function() {
      $mdDialog.show({
        controller: "AddStoreProductController",
        controllerAs: "vm",
        templateUrl:
          "app/stores/add-store-product/add-store-product.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.storeProductGrid.innerHTML = "";
          vm.retriveStoreProducts();
        }
      });
    };
    vm.printData = function() {

      $window.print();
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

    function openProductDocuments(itemToViewItsDocuments){
      var item = {
        Product_Code: itemToViewItsDocuments.Product_Code,
        Product_Name: itemToViewItsDocuments.Product_Name
      };
      $mdDialog.show({
        controller: "ViewStoreProductDocumentsController",
        controllerAs: "vm",
        templateUrl: "app/stores/view-documents/view-documents.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.storeProductGrid.innerHTML = "";
          vm.retriveStoreProducts();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }
    function openStoreProductToEdit(itemToEdit){
      $mdDialog.show({
        controller: "EditStoreController",
        controllerAs: "vm",
        templateUrl: "app/stores/edit-store-product/edit-store-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.storeProductGrid.innerHTML = "";
          vm.retriveStoreProducts();
        },
        locals: {
          itemToEdit: itemToEdit
        }
      });
    }

    function Output(itemToOutput){
      
      $mdDialog.show({
        controller: "OutputStoreController",
        controllerAs: "vm",
        templateUrl: "app/stores/output-store-product/output-store-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.storeProductGrid.innerHTML = "";
          vm.retriveStoreProducts();
        },
        locals: {
          Product_ID_In_Store: itemToOutput._id
        }
      });
    }

  }
})();
