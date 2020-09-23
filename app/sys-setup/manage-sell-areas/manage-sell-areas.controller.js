(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageSellAreaController', ManageSellAreaController);

    /* @ngInject */
    function ManageSellAreaController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.SellAreaGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveSellArea();
        function retriveSellArea(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getSellingArea",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.SellAreaList = data.data;
            }
            else{
                vm.SellAreaList = data.data;
            }
            vm.SellAreaGrid.jsGrid({
                width: "100%",
                height: "400px",
                autoload: false,
                sorting: true,
                selecting: false,
                paging: true,
                inserting: false,
                editing: false,
                pageIndex: 1,
                pageSize: 20,
                pageButtonCount: 15,
                data: vm.SellAreaList,
                fields: [
                    { title: "Code", name: "SellingArea_Code", type: "number", width: 35},
                    { title: "Name", name: "SellingArea_Name", type: "text", width: 100},
                    { title: "Desc", name: "SellingArea_Description", type: "text", width: 100},
                    { title: "Active",  name: "SellingArea_IsActive", type: "checkbox", width: 40},
                     {// show customers
                        title: "",
                        width: 20,
                        itemTemplate: function(value, item) {
                          var $link = $("<button>")
                            .attr(
                              "class",
                              "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                            )
                            .attr("title","show Customers")
                            .text("")
                            .on("click", function() {
                              showCustomers(item);
                            });
                          return $link;
                        }
                      },
                       {// show suppliers
                        title: "",
                        width: 20,
                        itemTemplate: function(value, item) {
                          var $link = $("<button>")
                            .attr(
                              "class",
                              "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                            )
                            .attr("title","show Suppliers")
                            .text("")
                            .on("click", function() {
                              showSuppliers(item);
                            });
                          return $link;
                        }
                      },
                      {// show products
                        title: "",
                        width: 20,
                        itemTemplate: function(value, item) {
                          var $link = $("<button>")
                            .attr(
                              "class",
                              "md-primary md-raised rxp-ingrid-btt rxp-ingrid-viewbtt rxp-ingrid-editbtt md-button md-cyan-theme md-ink-ripple"
                            )
                            .attr("title","show Products")
                            .text("")
                            .on("click", function() {
                              showProducts(item);
                            });
                          return $link;
                        }
                      },
                    { title: "",  width: 20, 
                    itemTemplate: function(value, item) {
                        var $link = $("<button>").attr("class", "md-primary md-raised rxp-ingrid-btt rxp-ingrid-editbtt  md-button md-cyan-theme md-ink-ripple").text("")
                        .on("click", function () {
                            openSellAreaToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function showCustomers(itemToViewItsCustomers){
            var item = {
              SellingArea_Code: itemToViewItsCustomers.SellingArea_Code,
              SellingArea_Name: itemToViewItsCustomers.SellingArea_Name
            };
            $mdDialog.show({
              controller: "ViewCustomerControllerForSellingAreas",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-sell-areas/view-customers.tmpl.html",
              clickOutsideToClose: false,
              focusOnOpen: false,
              //targetEvent: $event,
              onRemoving: function(event, removePromise) {
                vm.SellAreaGrid.innerHTML = "";
                    retriveSellArea();
              },
              locals: {
                itemToViewItsCustomers: item
              }
            });
          }
          function showSuppliers(itemToViewItsCustomers){
            var item = {
              SellingArea_Code: itemToViewItsCustomers.SellingArea_Code,
              SellingArea_Name: itemToViewItsCustomers.SellingArea_Name
            };
            $mdDialog.show({
              controller: "ViewSupplierControllerForSellingAreas",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-sell-areas/view-suppliers.tmpl.html",
              clickOutsideToClose: false,
              focusOnOpen: false,
              //targetEvent: $event,
              onRemoving: function(event, removePromise) {
                vm.SellAreaGrid.innerHTML = "";
                    retriveSellArea();
              },
              locals: {
                itemToViewItsSuppliers: item
              }
            });
          }
          function showProducts(itemToViewItsProducts){
            var item = {
              SellingArea_Code: itemToViewItsProducts.SellingArea_Code,
              SellingArea_Name: itemToViewItsProducts.SellingArea_Name
            };
            $mdDialog.show({
              controller: "ViewProductsControllerForSellingAreas",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-sell-areas/view-products.tmpl.html",
              clickOutsideToClose: false,
              focusOnOpen: false,
              //targetEvent: $event,
              onRemoving: function(event, removePromise) {
                vm.SellAreaGrid.innerHTML = "";
                    retriveSellArea();
              },
              locals: {
                itemToViewItsProducts: item
              }
            });
          }

        function openSellAreaToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditSellAreaController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-sell-areas/edit-sell-area.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.SellAreaGrid.innerHTML = "";
                    retriveSellArea();
                },
                locals: {
                    itemToEdit: itemToEdit
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddSellAreaController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-sell-areas/add-sell-area.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.SellAreaGrid.innerHTML = "";
                    retriveSellArea();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/getSellingAreaByName",
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.SellAreaList =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();