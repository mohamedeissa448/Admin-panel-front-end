(function() {
  "use strict";

  angular
    .module("sales")
    .controller("ManageSalesController", ManageSalesController);

  /* @ngInject */
  function ManageSalesController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.salesProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");

    function createJsGrid() {
      vm.salesProductGrid.jsGrid({
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
        data: vm.saleslist,
        fields: [
          {title: "Product Code",name: "Product_Code",align: "center",type: "number",width: 15},
          {
            title: "Product Name",
            name: "Product_Name",
            type: "text",
            align: "center",
            width: 30
          },
          // Edit product of sale
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
                  openSaleProductToEdit(item);
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
        ]
      });
    }
    vm.printData = function() {

      $window.print();
    }
    vm.retriveSales= function(letter) {
      var dataTosend ={ letter: letter,filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In sales.User can see all sales'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllSalesProducts",//35.246.143.96:3111
        data: dataTosend
      }).then(function(data) {
        vm.saleslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retriveSales();

    //ASC order
    vm.ASC_Order =function (){
      var dataTosend ={ filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In sales.User can see all sales'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrderGetAllSalesProducts",
        data: dataTosend 
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.saleslist = data.data
          console.log(data.data)
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
      if(!vm.CurrentUser.permissions.includes('In sales.User can see all sales'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;

      $http({
        method: "post",
        url: "http://35.246.143.96:3111/DESCOrderGetAllSalesProducts",
        data: dataTosend
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.saleslist = data.data
          console.log(data.data)
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function openSaleProductToEdit (itemToEdit){
      $mdDialog.show({
        controller: "EditSaleController",
        controllerAs: "vm",
        templateUrl: "app/sales/edit-sale/edit-sale.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.salesProductGrid.innerHTML = "";
          vm.retriveSales();
        },
        locals: {
          itemToEdit: itemToEdit
        }
      });
    }

    vm.searchForOffer = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      var results = vm.saleslist.filter(function(Offer) {
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
      vm.isLoading = true;
      vm.search={}
       if (vm.selectSearchType == "Product_Name") {
        vm.search.Product_Name = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_Code") {
        vm.search.Product_Code = vm.SellingSearch;
      }else if (vm.selectSearchType == "Customer_Name") {
        vm.search.Product_Sold_To_Customer_Name = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Customer_Code") {
        vm.search.Product_Sold_To_Customer_Code = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_Selling_Date") {
        vm.search.Product_Selling_Date = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_OutGoing_Bill_Number") {
        vm.search.Product_OutGoing_Bill_Number = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_Incoming_Supplier_Permission_Number") {
        vm.search.Product_Incoming_Supplier_Permission_Number = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Total_Price_After_Taxes") {
        vm.search.Total_Price_After_Taxes = vm.SellingSearch;
      }
      vm.search.SellingProduct_CreatedByUser = vm.CurrentUser.mongoID;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/searchSales",
        data:  vm.search
      }).then(function(data) {
        if (data.data.message == "No Data Found !!") {
          vm.saleslist = data.data;
          createJsGrid();
        } else {
          vm.saleslist = data.data;
          createJsGrid();
        }
      });
    };

    vm.showAddSale = function() {
      $mdDialog.show({
        controller: "AddSaleProductController",
        controllerAs: "vm",
        templateUrl:
          "app/sales/add-sales-product/add-sales-product.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.salesProductGrid.innerHTML = "";
          vm.retriveSales();
        }
      });
    };

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
        controller: "ViewPurchasingProductDocumentsController",
        controllerAs: "vm",
        templateUrl: "app/purchasing/view-documents/view-documents.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.salesProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }
  }
})();
