(function() {
  "use strict";

  angular
    .module("purchasing")
    .controller("ManagepurchasingController", ManagepurchasingController);

  /* @ngInject */
  function ManagepurchasingController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.purchasingProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");
    console.log("vm.CurrentUser",vm.CurrentUser)
    function createJsGrid() {
      vm.purchasingProductGrid.jsGrid({
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
        data: vm.purchasingslist,
        fields: [
          {title: "Product_Code",name: "Product_Code",align: "center",type: "number",width: 15},
          {
            title: "Product_Name",
            name: "Product_Name",
            type: "text",
            width: 30
          },
          {title: "Unit",name: "weight.Weight_Name",align: "center",type: "number",width: 15},
          {
            title: "Quantity",align: "center",type: "number",width: 15,
            itemTemplate:function(value,item){
              if(item.Product_Quantity)
              return item.Product_Quantity.toFixed(2)
              return ""
            } 
        },
          {title: "Unit Price",name: "Price_Of_Unit_Before_Taxes",align: "center",type: "number",width: 15,
          itemTemplate:function(value,item){
            if(item.Price_Of_Unit_Before_Taxes)
            return item.Price_Of_Unit_Before_Taxes.toFixed(2)
            return ""
          } 
        },
          {title: "Total Price Before",name: "Total_Price_Before_Taxes.toFixed(2)",align: "center",type: "number",width: 15,
          itemTemplate:function(value,item){
            if(item.Total_Price_Before_Taxes)
            return item.Total_Price_Before_Taxes.toFixed(2)
            return ""
          } 
        },
          {title: "Taxes Value",align: "center",type: "number",width: 15,
          itemTemplate:function(value,item){
            if(item.Taxes_Value)
            return item.Taxes_Value.toFixed(2)
            return ""
          } 
        },
          {title: "Total Price After",align: "center",type: "number",width: 15,
          itemTemplate:function(value,item){
            if(item.Total_Price_After_Taxes)
            return item.Total_Price_After_Taxes.toFixed(2)
            return ""
          } 
        },

          // Edit product of purchasing
          {
            title: "Edit",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link;
              if(vm.CurrentUser.permissions.includes('edit-purchasing')){
                 $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .on("click", function() {
                  openPurchasingProductToEdit(item);
                });
              }else

              $link=""
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

    vm.retrivePurchasings= function (letter) {
      var dataTosend ={ letter: letter,filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In purchasing.User can see all purchasings'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllPurchasings",//35.246.143.96:3111
        data: dataTosend
      }).then(function(data) {
        vm.purchasingslist = data.data
        console.log(data.data)
        createJsGrid();
      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retrivePurchasings();
    //ASC order
    vm.ASC_Order =function (){
      var dataTosend ={ filterBy: vm.selectSearchType }
      if(!vm.CurrentUser.permissions.includes('In purchasing.User can see all purchasings'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrderGetAllPurchasings",
        data: dataTosend 
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.purchasingslist = data.data
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
      if(!vm.CurrentUser.permissions.includes('In purchasing.User can see all purchasings'))
         dataTosend.user_id = vm.CurrentUser.mongoID ;

      $http({
        method: "post",
        url: "http://35.246.143.96:3111/DESCOrderGetAllPurchasings",
        data: dataTosend
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.purchasingslist = data.data
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function openPurchasingProductToEdit (itemToEdit){
      $mdDialog.show({
        controller: "EditPurchasingController",
        controllerAs: "vm",
        templateUrl: "app/purchasing/edit-purchasing/edit-purchasing.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings('A');
        },
        locals: {
          itemToEdit: itemToEdit
        }
      });
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
      else if (vm.selectSearchType == "Product_Purchasing_Date") {
        vm.search.Product_Purchasing_Date = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Incoming_Bill_Number") {
        vm.search.Product_Incoming_Bill_Number = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Incoming_Supplier_Permission_Number") {
        vm.search.Product_Incoming_Supplier_Permission_Number = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Total_Price_After_Taxes") {
        vm.search.Total_Price_After_Taxes = vm.PurchasingSearch;
      }
      vm.search.PurchasingProduct_CreatedByUser = vm.CurrentUser.mongoID;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/searchPurchasing",
        data:  vm.search
      }).then(function(data) {
        if (data.data.message == "No Data Found !!") {
          vm.purchasingslist = data.data;
          createJsGrid();
        } else {
          vm.purchasingslist = data.data;
          if(vm.selectSearchType == "Product_Incoming_Bill_Number"){
            vm.Total_Bill_Prices_Before_Taxes = 0;
            vm.Total_Bill_Prices_Taxes = 0;
            vm.Total_Bill_Prices_After_Taxes = 0;
            angular.forEach(vm.purchasingslist, function(item, index) {
              vm.Total_Bill_Prices_Before_Taxes += item.Total_Price_Before_Taxes;
              vm.Total_Bill_Prices_Taxes += item.Taxes_Value ;
              vm.Total_Bill_Prices_After_Taxes += item.Total_Price_After_Taxes
            });
          }
          createJsGrid();
        }
      });
    };

    vm.showAddPurchasing = function() {
      $mdDialog.show({
        controller: "AddPurchasingProductController",
        controllerAs: "vm",
        templateUrl:
          "app/purchasing/add-purchase-product/add-purchase-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings('A');
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
        controller: "ViewPurchasingProductDocumentsController",
        controllerAs: "vm",
        templateUrl: "app/purchasing/view-documents/view-documents.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }
  }
})();
