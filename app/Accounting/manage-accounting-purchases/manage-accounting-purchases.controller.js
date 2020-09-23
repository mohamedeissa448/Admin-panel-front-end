(function() {
  "use strict";

  angular
    .module("accounting")
    .controller("ManageAccountingPurchasesController", ManageAccountingPurchasesController);

  /* @ngInject */
  function ManageAccountingPurchasesController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.purchasingProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");
    vm.showBillMoreDetails =false;
    function createJsGrid() {
      vm.purchasingProductGrid.jsGrid({
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
            title: "Purchasing Date",
            type: "text",
            width: 30,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                if (!String.prototype.format) {
                  String.prototype.format = function() {
                    return this.replace(/(\{\d+\})/g, function(a) {
                      return args[+(a.substr(1, a.length - 2)) || 0];
                    });
                  };
                }
                var todayTime = new Date(item.Product_Purchasing_Date);
                var month = todayTime.getMonth() + 1
                var day = todayTime.getDate();
                var year = todayTime.getFullYear();
  
                return day + "/" + month + "/" + year;
              }else
              return "";
              
            }
          },
          {
            title: "Bill Number",align: "center",type: "number",width: 20,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Incoming_Bill_Number
              }else 
              return "";
            }
          },
          {
            title: "Supplier Permission Num",align: "center",type: "number",width: 20,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Incoming_Supplier_Permission_Number
              }else 
              return "";
            }

          },
          {
            title: "HighChem Permission Num",align: "center",type: "number",width: 20,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Incoming_HighChem_Permission_Number
              }else 
              return "";
            }
          },
          {
            title: "Supplier Name",align: "center",type: "number",width: 50,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Supplier_Name ;
              }else 
              return "";
            }
          },
          {
            title: "Supplier Code",align: "center",type: "number",width: 20,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Supplier_Code ;
              }else 
              return "";
            }
          },
          {
            title: "Product Name",type: "text",align: "center", width: 50,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Name ;
              }else 
              return "";
            }
          },
          {
            title: "Product Code",align: "center",type: "number",width: 20,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Code ;
              }else 
              return "";
            }
          },
          {
            title: "Num of packages",
            type: "text",
            align: "center",
            width: 30,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Number_Of_Packages;
              }
              else
              return "";
            }
          },
          {
            title: "Unit",
            type: "text",
            align: "center",
            width: 30,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                if(item.weight)
                return item.weight.Weight_Name;
              }
              else
              return "";
            }
          },
          
          {
            title: "Quantity",align: "center",type: "number",width: 20,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from purchasing date till quantity')){
                return item.Product_Quantity.toFixed(2) ;
              }else 
              return "";
            }
          },
          {
            title: "Total Price After Taxes",
            type: "text",
            align: "center",
            width: 30,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see total prices after taxes column') || vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on pay button,can see total paid price,paid percentage,remaining,show payments,total price after taxes')){
                if( item.Total_Price_After_Taxes)
                return item.Total_Price_After_Taxes.toFixed(2);
                else return ""
              }else
              return "";
            }
          },
          {
            title: "Total Paid Price",
            type: "text",
            align: "center",
            width: 30,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from total paid price till remaining column') || vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on pay button,can see total paid price,paid percentage,remaining,show payments,total price after taxes')){
                return item.Total_Paid_Price.toFixed(2);
              }else 
              return "";
            }
          },
          {
            title: "Paid Percentage",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from total paid price till remaining column') || vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on pay button,can see total paid price,paid percentage,remaining,show payments,total price after taxes')){
                var percentage = (item.Total_Paid_Price / item.Total_Price_After_Taxes) * 100
                return percentage.toFixed(2) + ' %';
              }else
              return "" ;
            }
          },
          {
            title: "Remaining",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.can see from total paid price till remaining column') || vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on pay button,can see total paid price,paid percentage,remaining,show payments,total price after taxes')){
                var percentage = item.Total_Price_After_Taxes - item.Total_Paid_Price;
                if(percentage)
                return percentage.toFixed(2) ;
                else return ""
              }else
              return "";
              
            }
          },
          // show purchasing details
          {
            title: "Purchasing Details",
            width: 20,
            align: "center",
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .text("")
                .attr("title","show purchasing details")
                .on("click", function() {
                  openPurchasingProductToEdit(item);
                });
              return $link;
            }
          },
          {
            title: "Product Details",
            width: 20,
            itemTemplate: function(value, item) {
              var $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Show product Details")
                .text("")
                .on("click", function() {
                  openProductToView(item);
                });
              return $link;
            }
          },
          //Eissaa
          {
            title: "Documents",
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
            title: "Pay",
            width: 20,
            itemTemplate: function(value, item) {
              var $link
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on pay button,can see total paid price,paid percentage,remaining,show payments,total price after taxes')){
                $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-productbtt  md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Pay")
                .text("")
                .on("click", function() {
                  pay(item);
                });
              }else
              $link = "";
               
              return $link;
            }
          },
          {
            title: "Show Payments without editing",
            width: 20,
            itemTemplate: function(value, item) {
              var $link ;
              if( vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on pay button,can see total paid price,paid percentage,remaining,show payments,total price after taxes')){
                $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Show Payments without editing")
                .text("")
                .on("click", function() {
                  showPaymentsWithoutEditing(item);
                });
              }else
              $link = "";
        
              return $link;
            }
          },
          {
            title: "Show Payments with editing",
            width: 20,
            itemTemplate: function(value, item) {
              var $link;
              if(vm.CurrentUser.permissions.includes('in-accounting-purchases.Can click on show payments with editing button')){
                 $link = $("<button>")
                .attr(
                  "class",
                  "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                )
                .attr("title","Show Payments")
                .text("")
                .on("click", function() {
                  showPayments(item);
                });
              }else
                 $link = "";
              
              return $link;
            }
          }
        ]
      });
    }

    vm.retrivePurchasings=function (letter) {
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllPurchasingsForAccounting",//35.246.143.96:3111
        data:{user_id :vm.CurrentUser.mongoID, letter:letter,filterBy: vm.selectSearchType}
      }).then(function(data) {
        vm.generallist = data.data
        console.log(data.data);
        if (vm.selectSearchType == "Product_Incoming_Bill_Number") {
          vm.showBillMoreDetails = true;
          vm.Total_Bill_Prices_After_Taxes = 0;
          vm.Total_Bill_Paid_Prices = 0;
          vm.Total_Bill_Remaining_Money = 0;
          angular.forEach(vm.generallist, function(element, key) {
            vm.Total_Bill_Prices_After_Taxes += element.Total_Price_After_Taxes ;
            vm.Total_Bill_Paid_Prices += element.Total_Paid_Price ;
          });
          vm.Total_Bill_Remaining_Money = vm.Total_Bill_Prices_After_Taxes - vm.Total_Bill_Paid_Prices;
        }
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
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrderGetAllPurchasingsForAccounting",
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
        url: "http://35.246.143.96:3111/DESCOrderGetAllPurchasingsForAccounting",
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

    function openPurchasingProductToEdit (itemToEdit){
      $mdDialog.show({
        controller: "ShowPurchasingDetailsController",
        controllerAs: "vm",
        templateUrl: "app/Accounting/show-purchasing-details/show-purchasing-details.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings();
        },
        locals: {
          itemToEdit: itemToEdit
        }
      });
    }

    vm.showPayForBills=function (){
      $mdDialog.show({
        controller: "PayForBillsForPurchasingsController",
        controllerAs: "vm",
        templateUrl:
          "app/Accounting/payForBills/payForBills.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings();
        }
      });
    }

    vm.searchForOffer = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      var results = vm.generallist.filter(function(Offer) {
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
        vm.search.Product_Name = vm.PurchasingSearch;
      }
      else if (vm.selectSearchType == "Product_Code") {
        vm.search.Product_Code = vm.PurchasingSearch;
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
          vm.generallist = data.data;
          createJsGrid();
        } else {
          vm.generallist = data.data;
          if (vm.selectSearchType == "Product_Incoming_Bill_Number") {
            vm.showBillMoreDetails = true;
            vm.Total_Bill_Prices_After_Taxes = 0;
            vm.Total_Bill_Paid_Prices = 0;
            vm.Total_Bill_Remaining_Money = 0;
            angular.forEach(vm.generallist, function(element, key) {
              vm.Total_Bill_Prices_After_Taxes += element.Total_Price_After_Taxes ;
              vm.Total_Bill_Paid_Prices += element.Total_Paid_Price ;
            });
            vm.Total_Bill_Remaining_Money = vm.Total_Bill_Prices_After_Taxes - vm.Total_Bill_Paid_Prices;
          }
          createJsGrid();
        }
      });
    };

  /*  vm.showAddPurchasing = function() {
      $mdDialog.show({
        controller: "AddPurchasingProductController",
        controllerAs: "vm",
        templateUrl:
          "app/purchasing/add-purchase-product/add-purchase-product.tmpl.html",
        clickOutsideToClose: true,
        focusOnOpen: false,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          retrivePurchasings();
        }
      });
    };*/

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
          vm.retrivePurchasings();
        },
        locals: {
          itemToViewItsDocuments: item
        }
      });
    }

    function pay(itemToPay){
      var item = {
        _id:itemToPay._id,
        Product_Code: itemToPay.Product_Code,
        Product_Name: itemToPay.Product_Name,
        Product_Incoming_Bill_Number:itemToPay.Product_Incoming_Bill_Number
      };
      $mdDialog.show({
        controller: "PayForPurchasingController",
        controllerAs: "vm",
        templateUrl: "app/Accounting/pay/pay.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings();
        },
        locals: {
          itemToPay: item
        }
      });
    }

    function showPayments(itemToPay){
      var item = {
        _id:itemToPay._id,
        Product_Code: itemToPay.Product_Code,
        Product_Name: itemToPay.Product_Name,
        Product_Incoming_Bill_Number:itemToPay.Product_Incoming_Bill_Number
      };
      $mdDialog.show({
        controller: "ShowPaymentsForPurchasingController",
        controllerAs: "vm",
        templateUrl: "app/Accounting/show-payments/show-payments.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings();
        },
        locals: {
          itemToPay: item
        }
      });
    }

    function showPaymentsWithoutEditing(itemToPay){
      var item = {
        _id:itemToPay._id,
        Product_Code: itemToPay.Product_Code,
        Product_Name: itemToPay.Product_Name,
        Product_Incoming_Bill_Number:itemToPay.Product_Incoming_Bill_Number
      };
      $mdDialog.show({
        controller: "ShowPaymentsWithoutEditingForPurchasingController",
        controllerAs: "vm",
        templateUrl: "app/Accounting/show-payments-without-editing/show-payments-without-editing.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.purchasingProductGrid.innerHTML = "";
          vm.retrivePurchasings();
        },
        locals: {
          itemToPay: item
        }
      });
    }

    vm.printData = function() {

      $window.print();
    }


  }
})();
