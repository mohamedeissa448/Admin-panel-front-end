(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageCategoryController', ManageCategoryController);

    /* @ngInject */
    function ManageCategoryController($mdDialog,$http) {
        var vm = this;
        vm.CategoryGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveCategories();
        function retriveCategories(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getCategories",
                data :{}
            }).then(function(data){
                console.log("data",data)
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.Categorieslist = data.data;
            }
            else{
                vm.Categorieslist = data.data;
            }
            vm.CategoryGrid.jsGrid({
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
                data: vm.Categorieslist,
                fields: [
                    { title: "Code", name: "Category_ID", type: "number", width: 35},
                    { title: "Category Name", name: "Category_Name", type: "text", width: 100},
                    { title: "Desc", name: "Category_Description", type: "text", width: 100},
                    { title: "Active",  name: "Category_IsActive", type: "checkbox", width: 40},
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
                            openCategortToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function showCustomers(itemToViewItsCustomers){
            var item = {
              Category_ID: itemToViewItsCustomers.Category_ID,
              Category_Name: itemToViewItsCustomers.Category_Name
            };
            $mdDialog.show({
              controller: "ViewCustomerController",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-category/view-customers.tmpl.html",
              clickOutsideToClose: false,
              focusOnOpen: false,
              //targetEvent: $event,
              onRemoving: function(event, removePromise) {
                vm.CategoryGrid.innerHTML = "";
                retriveCategories();
              },
              locals: {
                itemToViewItsCustomers: item
              }
            });
          }
          function showSuppliers(itemToViewItsCustomers){
            var item = {
              Category_ID: itemToViewItsCustomers.Category_ID,
              Category_Name: itemToViewItsCustomers.Category_Name
            };
            $mdDialog.show({
              controller: "ViewSupplierController",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-category/view-suppliers.tmpl.html",
              clickOutsideToClose: false,
              focusOnOpen: false,
              //targetEvent: $event,
              onRemoving: function(event, removePromise) {
                vm.CategoryGrid.innerHTML = "";
                retriveCategories();
              },
              locals: {
                itemToViewItsSuppliers: item
              }
            });
          }
          function showProducts(itemToViewItsProducts){
            var item = {
              Category_ID: itemToViewItsProducts.Category_ID,
              Category_Name: itemToViewItsProducts.Category_Name
            };
            $mdDialog.show({
              controller: "ViewProductsController",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-category/view-products.tmpl.html",
              clickOutsideToClose: false,
              focusOnOpen: false,
              //targetEvent: $event,
              onRemoving: function(event, removePromise) {
                vm.CategoryGrid.innerHTML = "";
                retriveCategories();
              },
              locals: {
                itemToViewItsProducts: item
              }
            });
          }
        function openCategortToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditCategoryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-category/edit-category.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.CategoryGrid.innerHTML = "";
                    retriveCategories();
                },
                locals: {
                    CategoryID: itemToEdit.Category_ID,
                    CategoryName: itemToEdit.Category_Name,
                    CategoryDesc: itemToEdit.Category_Description,
                    CategoryStatus: itemToEdit.Category_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddCategoryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-category/add-category.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.CategoryGrid.innerHTML = "";
                    retriveCategories();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getCategoryByname',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.Categorieslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
            
        }
    }
})();