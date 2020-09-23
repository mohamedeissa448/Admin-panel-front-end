(function() {
  "use strict";

  angular
    .module("stores")
    .controller("StoreProductCardController", StoreProductCardController);

  /* @ngInject */
  function StoreProductCardController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.storeProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");

    function createJsGrid() {
      vm.storeProductGrid.jsGrid({
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
        data: vm.newStoresArray,//vm.storeProductslist,
        fields: [
          {
            title: "Storing Date",
            type: "text",
            width: 50,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num') || vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns') ){
                if (!String.prototype.format) {
                  String.prototype.format = function() {
                    return this.replace(/(\{\d+\})/g, function(a) {
                      return args[+(a.substr(1, a.length - 2)) || 0];
                    });
                  };
                }
                var todayTime = new Date(item.Product_Storing_Date);
                var month = todayTime.getMonth() + 1
                var day = todayTime.getDate();
                var year = todayTime.getFullYear();
  
                return day + "/" + month + "/" + year;
              }else 
              return "";
              
            }
          },
          {title: "Product Code",align: "center",type: "number",width: 30,
          itemTemplate: function(value, item) {
            if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')  || vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
              return item.Product_Code
            }else 
            return "" ;
          }
        },
          {
            title: "Product Name",
            type: "text",
            width: 80,
            align:"center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')  || vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
                return item.Product_Name
              }else 
              return "" ;
  
            }
          },
          {
            title: "Supplier Code",align: "center",type: "number",width: 30,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num') ){
                return item.Supplier_Code
              }else 
              return "" ;
            }
          },
          {
            title: "Supplier Name",
            type: "text",
            width: 80,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')){
                return item.Supplier_Name
              }else 
              return "" ;
            }
          },
          {
            title: "Input Quantity",
            type: "text",
            width: 40,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')){
                return item.purchasing.Product_Quantity;
              }else 
              return "" ;
            }
          },
          {
            title: "Bill Number",
            type: "text",
            width: 50,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')){
                return item.purchasing.Product_Incoming_Bill_Number;
              }else 
              return "" ;
            }
          },
          {
            title: "Supplier Permission Num",
            type: "text",
            width: 40,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')){
                return item.purchasing.Product_Incoming_Supplier_Permission_Number;
              }else 
              return "" ;
            }
          },
          {
            title: "HighChem Permission Num",
            type: "text",
            width: 40,
            align: "center",
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see from storing date till highChem Perm Num')){
                return item.Product_Incoming_HighChem_Permission_Number;
              }else 
              return "" ;
            }
          },
          {
            title: "Dispatch Date",align: "center",type: "number",width: 40,
          itemTemplate: function(value, item) {
            if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
              if(item.Product_OutGoing_Date){
                if (!String.prototype.format) {
                  String.prototype.format = function() {
                    return this.replace(/(\{\d+\})/g, function(a) {
                      return args[+(a.substr(1, a.length - 2)) || 0];
                    });
                  };
                }
                var todayTime = new Date(item.Product_OutGoing_Date);
                var month = todayTime.getMonth() + 1
                var day = todayTime.getDate();
                var year = todayTime.getFullYear();
    
                return day + "/" + month + "/" + year;
              }else
              return '';
            }else
            return "" ;
            
           
          }
        },
          {
            title: "Customer Code",align: "center",type: "number",width: 40,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
                return item.Product_Sold_To_Customer_Code
              }else
              return "" ;
            }
        },
          {
            title: "Customer Name",align: "center",type: "number",width: 80,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
                return item.Product_Sold_To_Customer_Name
              }else
              return "" ;
            }
          },
          {
            title: "Dispatch Quantity",align: "center",type: "number",width: 50,
          itemTemplate: function(value, item) {
            if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
              return item.Product_OutGoing_Quantity ? item.Product_OutGoing_Quantity.toFixed(2) : ''
            }else
            return "";
          }
        },
          {
            title: "Left Quantity",align: "center",type: "number",width: 50,
          itemTemplate: function(value, item) {
            if(vm.CurrentUser.permissions.includes('in-stores-product card.can see left quantity column')){
              return item.Product_Left_Quantity ? item.Product_Left_Quantity.toFixed(2) : '';
            }else
            return "" ;
          }
        },
          {
            title: "Left Quantity Cost",align: "center",type: "number",width: 50,
          itemTemplate: function(value, item) {
            if(vm.CurrentUser.permissions.includes('in-stores-product card.can see left quantity cost column')){
              return item.Product_Left_Quantity_Cost ? item.Product_Left_Quantity_Cost.toFixed(2) : '';
            }else
            return "" ;
          }
          },
          {
            title: "HighChem Dispatch Permission",align: "center",type: "number",width: 50,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
                return item.HighChem_Dispatch_Permission;
              }else
              return "" ;
            }
          },
          {
            title: "Customer Bill",align: "center",type: "number",width: 50,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
                return item.Product_OutGoing_Bill_Number;
              }else
              return "" ;
            }
          },
          {
            title: "Customer Permission Number",align: "center",type: "number",width: 50,
            itemTemplate: function(value, item) {
              if(vm.CurrentUser.permissions.includes('in-stores-product card.can see dispatch columns')){
                return item.Product_OutGoing_Customer_Permission_Number;
              }else
              return "" ;
            }
          },
          
         /* // Edit product of store
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
          },*/
        ]
      });
    }

     vm.retriveStoreProducts= function(letter) {
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/getAllStoreProductsAllowedToUser",//35.246.143.96:3111
        data: { user_id: vm.CurrentUser.mongoID,letter:letter,filterBy: vm.selectSearchType }
      }).then(function(data) {
        vm.storeProductslist = data.data
        console.log(data.data);
        processArrayToShowInGrid(vm.storeProductslist);
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
      
      $http({
        method: "post",
        url: "http://35.246.143.96:3111/ASCOrderGetAllStoreProductsAllowedToUser",
        data: { user_id: vm.CurrentUser.mongoID,filterBy: vm.selectSearchType } 
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.storeProductslist = data.data
          console.log(data.data);
          processArrayToShowInGrid(vm.storeProductslist);
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
        url: "http://35.246.143.96:3111/DESCOrderGetAllStoreProductsAllowedToUser",
        data: { user_id: vm.CurrentUser.mongoID,filterBy: vm.selectSearchType }
      }).then(
        function(data) {
          triLoaderService.setLoaderActive(false);
          vm.storeProductslist = data.data
          console.log(data.data);
          processArrayToShowInGrid(vm.storeProductslist);
          createJsGrid();
        },
        function(error) {
          console.log(error);
        }
      );
    }

    function processArrayToShowInGrid(storeProductslist){
      //we need to manipulate vm.storeProductslist so we can show it in grid
    vm.newStoresArray = [];
    vm.total_cost_of_all_products_in_store = 0;
    angular.forEach(storeProductslist, function(outsideElement, outsideIndex) {
      var quantity = outsideElement.purchasing.Product_Quantity ;
      if(outsideElement.sales.length > 0){
        angular.forEach(outsideElement.sales, function(insideElement, insideIndex) {
          vm.newStoresArray.push({
            Product_Storing_Date : outsideElement.Product_Storing_Date,
            Product_Code         : outsideElement.Product_Code,
            Product_Name         : outsideElement.Product_Name,
            Supplier_Code         : outsideElement.Supplier_Code,
            Supplier_Name         : outsideElement.Supplier_Name,
            purchasing:{
              Product_Quantity                : outsideElement.purchasing.Product_Quantity,
              Product_Incoming_Bill_Number    : outsideElement.Product_Incoming_Bill_Number,
              Product_Incoming_Supplier_Permission_Number : outsideElement.Product_Incoming_Supplier_Permission_Number,
             }, 
             Product_Incoming_HighChem_Permission_Number : outsideElement.Product_Incoming_HighChem_Permission_Number ,
             Product_OutGoing_Date :outsideElement.Product_OutGoing[insideIndex].Product_OutGoing_Date,
             Product_Sold_To_Customer_Code : insideElement.Product_Sold_To_Customer_Code,
             Product_Sold_To_Customer_Name : insideElement.Product_Sold_To_Customer_Name,
             Product_OutGoing_Quantity: insideElement.Product_Quantity,
             Product_Left_Quantity : quantity - insideElement.Product_Quantity,
             Product_Left_Quantity_Cost : (quantity - insideElement.Product_Quantity) * outsideElement.purchasing.Price_Of_Unit_Before_Taxes + (outsideElement.purchasing.Amount_Of_Taxes * 0.01 * ((quantity - insideElement.Product_Quantity) * outsideElement.purchasing.Price_Of_Unit_Before_Taxes)) ,
             HighChem_Dispatch_Permission: outsideElement.Product_OutGoing[insideIndex].Product_OutGoing_HighChem_Permission_Number,
             Product_OutGoing_Bill_Number : outsideElement.Product_OutGoing[insideIndex].Product_OutGoing_Bill_Number,
             Product_OutGoing_Customer_Permission_Number : outsideElement.Product_OutGoing[insideIndex].Product_OutGoing_Customer_Permission_Number,

          });
          vm.total_cost_of_all_products_in_store += (quantity - insideElement.Product_Quantity) * outsideElement.purchasing.Price_Of_Unit_Before_Taxes + (outsideElement.purchasing.Amount_Of_Taxes * 0.01 * ((quantity - insideElement.Product_Quantity) * outsideElement.purchasing.Price_Of_Unit_Before_Taxes))
          quantity -= insideElement.Product_Quantity;
        })
      }else{
        vm.newStoresArray.push({
          Product_Storing_Date : outsideElement.Product_Storing_Date,
          Product_Code         : outsideElement.Product_Code,
          Product_Name         : outsideElement.Product_Name,
          Supplier_Code         : outsideElement.Supplier_Code,
          Supplier_Name         : outsideElement.Supplier_Name,
          purchasing:{
            Product_Quantity                : outsideElement.purchasing.Product_Quantity,
            Product_Incoming_Bill_Number    : outsideElement.Product_Incoming_Bill_Number,
            Product_Incoming_Supplier_Permission_Number : outsideElement.Product_Incoming_Supplier_Permission_Number,
           }, 
           Product_Incoming_HighChem_Permission_Number : outsideElement.Product_Incoming_HighChem_Permission_Number ,
           Product_Left_Quantity :  outsideElement.purchasing.Product_Quantity,
           Product_Left_Quantity_Cost : outsideElement.purchasing.Total_Price_After_Taxes ,

        });
        vm.total_cost_of_all_products_in_store += outsideElement.purchasing.Total_Price_After_Taxes;
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
        vm.storeProductslist = data.data;
        processArrayToShowInGrid(vm.storeProductslist) ;
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
      /*
      $mdDialog.show({
        controller: "OutputStoreController",
        controllerAs: "vm",
        templateUrl: "app/stores/output-store-product/output-store-product.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          vm.storeProductGrid.innerHTML = "";
          retriveProducts();
        },
        locals: {
          itemToOutput: itemToOutput
        }
      });*/
    }

  }
})();
