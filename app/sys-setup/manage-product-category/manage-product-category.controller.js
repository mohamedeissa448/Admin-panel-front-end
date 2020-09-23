(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('ManageProductCategoryController', ManageProductCategoryController);

    /* @ngInject */
    function ManageProductCategoryController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        var vm = this;
        vm.ProductCategoryGrid = angular.element( document.querySelector( '#jsGrid' ) );
        retriveProductCategories();
        function retriveProductCategories(){
            $http({
                method:"GET",
                url:"http://35.246.143.96:3111/getProductCategory",
                data :{}
            }).then(function(data){
                createJsGrid(data, false);
            },function(error){
                console.log(error);
            });
        }
        function createJsGrid(data, fromsearch){
            if(!fromsearch){
                vm.ProductCategorieslist = data.data;
            }
            else{
                vm.ProductCategorieslist = data.data;
            }
            vm.ProductCategoryGrid.jsGrid({
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
                data: vm.ProductCategorieslist,
                fields: [
                    { title: "Code", name: "ProductCategory_Code", type: "number", width: 35},
                    { title: "Product Category Name", name: "ProductCategory_Name", type: "text", width: 100},
                    { title: "Desc", name: "ProductCategory_Description", type: "text", width: 100},
                    { title: "Active",  name: "ProductCategory_IsActive", type: "checkbox", width: 40},
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
                            openProductCategortToEdit(item);
                        }) ;
                        return $link;
                    }},
                ]
            });
        }
        
        function showCustomers(itemToViewItsCustomers){
            var item = {
              Category_ID: itemToViewItsCustomers.ProductCategory_Code,
              Category_Name: itemToViewItsCustomers.ProductCategory_Name
            };
            $mdDialog.show({
              controller: "ViewCustomerControllerForProductCategory",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-product-category/view-customers.tmpl.html",
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
          function showSuppliers(itemToViewItsSuppliers){
            var item = {
              Category_ID: itemToViewItsSuppliers.ProductCategory_Code,
              Category_Name: itemToViewItsSuppliers.ProductCategory_Name
            };
            $mdDialog.show({
              controller: "ViewSupplierControllerForProductCategory",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-product-category/view-suppliers.tmpl.html",
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
              Category_ID: itemToViewItsProducts.ProductCategory_Code,
              Category_Name: itemToViewItsProducts.ProductCategory_Name
            };
            $mdDialog.show({
              controller: "ViewProductsControllerForProductCategory",
              controllerAs: "vm",
              templateUrl: "app/sys-setup/manage-product-category/view-products.tmpl.html",
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

        function openProductCategortToEdit(itemToEdit){
            $mdDialog.show({
                controller: 'EditProductCategoryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-product-category/edit-product-category.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                onRemoving: function (event, removePromise) {
                    vm.ProductCategoryGrid.innerHTML = "";
                    retriveProductCategories();
                },
                locals: {
                    ProductCategory_Code: itemToEdit.ProductCategory_Code,
                    ProductCategory_Name: itemToEdit.ProductCategory_Name,
                    ProductCategory_Description: itemToEdit.ProductCategory_Description,
                    ProductCategory_IsActive: itemToEdit.ProductCategory_IsActive
                }
            });
        }
        vm.showAddWindow = function(){
            $mdDialog.show({
                controller: 'AddProductCategoryController',
                controllerAs: 'vm',
                templateUrl: 'app/sys-setup/manage-product-category/add-product-category.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                //targetEvent: $event,
                onRemoving: function (event, removePromise) {
                    vm.ProductCategoryGrid.innerHTML = "";
                    retriveProductCategories();
                }
            });
        }
        vm.SubmitSearch= function(){
            var data = vm.SearchFor;
            $http({
                method:"POST",
                url:'http://35.246.143.96:3111/getProductCategoryByName',
                data :data
            }).then(function(data){ 
                if(data.data.message =="No Data Found !!"){
                    vm.ProductCategorieslist =[];
                    createJsGrid(data,false);
                }else{
                    createJsGrid(data,true);
                } 
            });
        }
    }
})();