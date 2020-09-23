(function() {
  "use strict";

  angular
    .module("accounting")
    .controller("ManageCustomerAccountStatementController", ManageCustomerAccountStatementController);

  /* @ngInject */
  function ManageCustomerAccountStatementController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.salesProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");

    function createJsGrid() {
      vm.salesProductGrid.jsGrid({
        width: "1800",
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
        data: vm.generallist,
        fields: [
          {
            title: "Selling Date",
            type: "text",
            width: 30,
            align: "center",
            itemTemplate: function(value, item) {
              if (!String.prototype.format) {
                String.prototype.format = function() {
                  return this.replace(/(\{\d+\})/g, function(a) {
                    return args[+(a.substr(1, a.length - 2)) || 0];
                  });
                };
              }
              var todayTime = new Date(item.Product_Selling_Date);
              var month = todayTime.getMonth() + 1
              var day = todayTime.getDate();
              var year = todayTime.getFullYear();

              return day + "/" + month + "/" + year;
            }
          },
          {title: "Bill Number",name: "Product_OutGoing_Bill_Number",align: "center",type: "number",width: 20},
          {title: "Customer Permission Num",name: "Product_OutGoing_Customer_Permission_Number",align: "center",type: "number",width: 20},
         // {title: "HighChem Permission Num",name: "Product_Incoming_HighChem_Permission_Number",align: "center",type: "number",width: 20},
          {title: "Customer Name",name: "Product_Sold_To_Customer_Name",align: "center",width: 20,},
          {title: "Customer Code",name: "Product_Sold_To_Customer_Code",align: "center",type: "number",width: 20},
          {title: "Product Code",name: "Product_Code",align: "center",type: "number",width: 15},
          {
            title: "Product Name",
            name: "Product_Name",
            type: "text",
            width: 30
          }, 
          {
            title: "Num of packages",
            name: "Product_Number_Of_Packages",
            type: "text",
            align: "center",
            width: 30
          },
          {
            title: "Unit",
            type: "text",
            align: "center",
            width: 30,
            itemTemplate: function(value, item) {
              if(item.weight)
                return item.weight.Weight_Name;
              else
              return "";
            }
          },
          {
            title: "Quantity",
            name: "Product_Quantity",
            type: "text",
            align: "center",
            width: 30
          },
          {
            title: "Total Price After Taxes",
            type: "text",
            width: 30,
            itemTemplate: function(value, item) {
              if(item.Total_Price_After_Taxes)
              return item.Total_Price_After_Taxes.toFixed(2);
              return "";
            }
          },
          {
            title: "Total Receivable Price",
            type: "text",
            width: 30,
            itemTemplate: function(value, item) {
              if(item.Total_Receivable_Price)
              return item.Total_Receivable_Price.toFixed(2);
              return "";
            }
          },
          {
            title: "Receivable Percentage",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var percentage = (item.Total_Receivable_Price / item.Total_Price_After_Taxes) * 100
              if(percentage)
              return percentage.toFixed(2) + ' %';
              return "";
            }
          },
          {
            title: "Remaining",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var percentage = item.Total_Price_After_Taxes - item.Total_Receivable_Price;
              if(percentage)
              return percentage.toFixed(2) ;
              return "";
            }
          }/*,
          // Edit product of sales
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
                .attr("title","Edit")
                .on("click", function() {
                  openSellingProductToEdit(item);
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
                .attr("title","getPaid")
                .text("")
                .on("click", function() {
                  getPaid(item);
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
                .attr("title","Show Receivables")
                .text("")
                .on("click", function() {
                  showReceivables (item);
                });
              return $link;
            }
          }*/
        ]
      });
    }

    vm.retriveSales=function (letter) {
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllSalesForAccounting",//35.246.143.96:3111
        data:{user_id :vm.CurrentUser.mongoID,letter:letter,filterBy: vm.selectSearchType}
      }).then(function(data) {
        vm.generallist = data.data
        console.log(data.data);
        if (vm.selectSearchType == "Product_OutGoing_Bill_Number") {
          vm.showBillMoreDetails = true;
          vm.Total_Bill_Prices_After_Taxes = 0;
          vm.Total_Bill_Receivable_Prices = 0;
          vm.Total_Bill_Remaining_Money = 0;
          angular.forEach(vm.generallist, function(element, key) {
            vm.Total_Bill_Prices_After_Taxes += element.Total_Price_After_Taxes ;
            vm.Total_Bill_Receivable_Prices += element.Total_Receivable_Price ;
          });
          vm.Total_Bill_Remaining_Money = vm.Total_Bill_Prices_After_Taxes - vm.Total_Bill_Receivable_Prices;
        }
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
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrderGetAllSalesForAccounting",
        data: {user_id :vm.CurrentUser.mongoID,filterBy: vm.selectSearchType} 
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.generallist = data.data;
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
        url: "http://35.246.143.96:3111/DESCOrderGetAllSalesForAccounting",
        data: {user_id :vm.CurrentUser.mongoID,filterBy: vm.selectSearchType}
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.generallist = data.data;
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function openSellingProductToEdit (itemToEdit){
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

    

    vm.SubmitSearch = function() {
      vm.isLoading = true;
      vm.search={}
       if (vm.selectSearchType == "Product_Name") {
        vm.search.Product_Name = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_Code") {
        vm.search.Product_Code = vm.SellingSearch;
      }else if (vm.selectSearchType == "Product_Sold_To_Customer_Name") {
        vm.search.Product_Sold_To_Customer_Name = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_Sold_To_Customer_Code") {
        vm.search.Product_Sold_To_Customer_Code = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_Selling_Date") {
        vm.search.Product_Selling_Date = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_OutGoing_Bill_Number") {
        vm.search.Product_OutGoing_Bill_Number = vm.SellingSearch;
      }
      else if (vm.selectSearchType == "Product_OutGoing_Customer_Permission_Number") {
        vm.search.Product_OutGoing_Customer_Permission_Number = vm.SellingSearch;
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
          vm.generallist = data.data;
        } else {
          vm.generallist = data.data;
          if (vm.selectSearchType == "Product_OutGoing_Bill_Number") {
            vm.showBillMoreDetails = true;
            vm.Total_Bill_Prices_After_Taxes = 0;
            vm.Total_Bill_Receivable_Prices = 0;
            vm.Total_Bill_Remaining_Money = 0;
            angular.forEach(vm.generallist, function(element, key) {
              vm.Total_Bill_Prices_After_Taxes += element.Total_Price_After_Taxes ;
              vm.Total_Bill_Receivable_Prices += element.Total_Receivable_Price ;
            });
            vm.Total_Bill_Remaining_Money = vm.Total_Bill_Prices_After_Taxes - vm.Total_Bill_Receivable_Prices;
          }
        }
        createJsGrid();
      });
    };

    vm.showGetPaidForBills=function (){
      $mdDialog.show({
        controller: "GetPaidForBillsForSalesController",
        controllerAs: "vm",
        templateUrl:
          "app/Accounting/getPaidForBills/getPaidForBills.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        
        onRemoving: function(event, removePromise) {
          vm.salesProductGrid.innerHTML = "";
          vm.retriveSales();
        }
      });
    }

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
          vm.salesProductGrid.innerHTML = "";
          vm.retriveSales();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }

    function getPaid(itemToGetPaid){
      var item = {
        _id:itemToGetPaid._id,
        Product_Code: itemToGetPaid.Product_Code,
        Product_Name: itemToGetPaid.Product_Name,
        Product_OutGoing_Bill_Number:itemToGetPaid.Product_OutGoing_Bill_Number
      };
      $mdDialog.show({
        controller: "GetPaidForSellingController",
        controllerAs: "vm",
        templateUrl: "app/Accounting/get-paid/get-paid.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.salesProductGrid.innerHTML = "";
          vm.retriveSales();
        },
        locals: {
          itemToGetPaid: item
        }
      });
    }

    function showReceivables (itemToGetPaid){
      var item = {
        _id:itemToGetPaid._id,
        Product_Code: itemToGetPaid.Product_Code,
        Product_Name: itemToGetPaid.Product_Name,
        Product_OutGoing_Bill_Number:itemToGetPaid.Product_OutGoing_Bill_Number
      };
      $mdDialog.show({
        controller: "ShowReceivablesForSellingController",
        controllerAs: "vm",
        templateUrl: "app/Accounting/show-receivables/show-receivables.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.salesProductGrid.innerHTML = "";
          vm.retriveSales();
          if (vm.selectSearchType == "Product_OutGoing_Bill_Number") {
            vm.showBillMoreDetails = true;
            vm.Total_Bill_Prices_After_Taxes = 0;
            vm.Total_Bill_Receivable_Prices = 0;
            vm.Total_Bill_Remaining_Money = 0;
            angular.forEach(vm.generallist, function(element, key) {
              vm.Total_Bill_Prices_After_Taxes += element.Total_Price_After_Taxes ;
              vm.Total_Bill_Receivable_Prices += element.Total_Receivable_Price ;
            });
            vm.Total_Bill_Remaining_Money = vm.Total_Bill_Prices_After_Taxes - vm.Total_Bill_Receivable_Prices;
          }
        },
        locals: {
          itemToGetPaid: item
        }
      });
    }
    //for statistics
    vm.retriveSalesForStatistics=function () {
      $http({
        method: "get",
        url: "http://35.246.143.96:3111/getAllSalesForStatistics",//we just need to get only Total_Receivable_Price and Total_Price_After_Taxes for all sales
      }).then(function(data) {
        vm.saleslist = data.data
        console.log(data.data);
        vm.Total_All_Sales_Prices_After_Taxes = 0 ;
        vm.Total_All_Sales_Receivables_Prices = 0 ;
        angular.forEach(vm.saleslist, function(element, key) {
          vm.Total_All_Sales_Prices_After_Taxes += element.Total_Price_After_Taxes ;
          vm.Total_All_Sales_Receivables_Prices += element.Total_Receivable_Price ;
        });
      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retriveSalesForStatistics();
   

  }
})();
