(function() {
    'use strict';

    angular
        .module('pricerequest')
        .controller('AddPriceRequestController', AddPriceRequestController);

    /* @ngInject */
    function AddPriceRequestController($mdToast,$mdDialog, triLoaderService,$http) {
        var vm = this;
        vm.RequestPrice={};
        $http.get("http://35.246.143.96:3111/getAllCustomer").then(function (data) {			   
            vm.Customerslist = data.data; 
        });
       
        $http.get("http://35.246.143.96:3111/getAllSupplier").then(function (response) {			   
            vm.selectedSupplierItem = null;
            vm.searchSupplierText = null;
            vm.querySuppliers = querySuppliers;
            vm.Suppliers = response.data;
            vm.Supplierslist = response.data;
            vm.selectedSuppliers = [];
            vm.transformChip = transformChip;   
            function querySuppliers($query) {
                var lowercaseQuery = angular.lowercase($query);
                return vm.Suppliers.filter(function(supplier) {
                    var lowercaseName = angular.lowercase(supplier.Supplier_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return supplier;
                    }
                });
            }
            ///console.log(vm.selectedSuppliers);
        });

        $http.get("http://35.246.143.96:3111/getCategories").then(function (data) {			   
            vm.CatigoryList = data.data; 
        });        
        
        function transformChip(chip) {
            if (angular.isObject(chip)) {
              return chip;
            }
            else{
                return null;
            }
        }
        
        $http({
            method:"GET",
            url:"http://35.246.143.96:3111/getProducts",
            data: {}
        }).then(function(data){
            vm.Productslist = data.data;
        })

        $http.get("http://35.246.143.96:3111/getWeight").then(function (data) {
            vm.WeightUnitsList = data.data;      
        });
                
        vm.ProductRequests = [];
        vm.ProductRequest =[];
        vm.AddProductRequest = function(){    
            if (!vm.selectedProduct || vm.Request_Amount == undefined || vm.Request_Units == undefined ){
                showAddErrorToast('You must Fill all product data',$mdToast);
            }else{   
            var ProductRequest ={
                Request_Product  : vm.selectedProduct.Product_Name,
                Request_Amount : vm.Request_Amount,
                Request_Units  : vm.Request_Units.Weight_Name,
                Product_ID : vm.selectedProduct.Product_Code,
                Quantity_Required   : vm.Request_Amount,
                Weight_ID :vm.Request_Units.Weight_Code,
            };
            
            vm.ProductRequests.push(
                ProductRequest                                
            );
            
            vm.selectedProduct = null;
            vm.Request_Amount ='';
            vm.Request_Units ='';
            }
        };

        vm.FilterSupplierByProduct = function(){
            $mdDialog.show({
                multiple: true,skipHide: true,
                controller: 'GetSuppliersByProductController',
                controllerAs: 'vmr',
                templateUrl: 'app/price-request/add-price-request/get-supplier-by-product.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                locals: {
                    productlist : vm.Productslist
                },
                //targetEvent: $event,
                // onRemoving: function (event, removePromise) {
                //     vm.RequestGrid.innerHTML = "";
                // }
            }).then(function(listOfSelectedSuppliers) {
                console.log(listOfSelectedSuppliers);
                console.log(vm.selectedSuppliers);

                vm.selectedSuppliers = listOfSelectedSuppliers;
                console.log(vm.selectedSuppliers);
              }, function() {
                console.log('You cancelled the dialog.');
              });;
        }

        vm.DeleteRequest = function(ProductRequests){
            vm.ProductRequests.splice(vm.ProductRequests.indexOf(ProductRequests), 1);
        };
        
        vm.searchForCustomer = function(query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vm.Customerslist.filter( function(customer) {
                    var lowercaseName = angular.lowercase(customer.Customer_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return customer;
                    }
                }
            );
            return results;
        };
        
        vm.searchForproduct = function(query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vm.Productslist.filter( function(product) {
                    var lowercaseName = angular.lowercase(product.Product_Name);
                    if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                        return product;
                    }
                }
            );
            return results;
        };

        vm.ClosemdDialog = function(){
            if(vm.PriceRequestForm.$dirty){
                ConfirmCloseDialog();
            }
            else{
                $mdDialog.hide();
            }
        }
        function ConfirmCloseDialog(){
            var Result;
            $mdDialog.show({
                multiple: true,skipHide: true,
                controllerAs:'confirmDialog',
                bindToController: true,
                controller: function($mdDialog){
                    var vmc = this;
                    vmc.closeform = function closeform(){
                        $mdDialog.hide();
                        Result =  true;
                    }
                    vmc.hide = function hide(){
                        $mdDialog.hide();
                        Result = false;
                    }
                  }
                ,template: GetConfirmCloseTemplate()
            }).then(function() {
                if(Result){
                    $mdDialog.hide();
                }
            });
        }
        vm.SubmitRequest=function (){
            if(vm.selectedSuppliers.length==0){
                showAddErrorToast('you must select one supplier at least',$mdToast);
                return;
            }
            else if (vm.ProductRequests.length == 0){
                showAddErrorToast('you must add one product at least',$mdToast);
                return;
            }
            else{
                triLoaderService.setLoaderActive(true);
                var ProductToSend =[];
                angular.copy(vm.ProductRequests, ProductToSend);
                ProductToSend.forEach(function(v){ delete v.Request_Product; delete v.Request_Units });
                vm.selectedSuppliersrrequest = [];
                var Price_Status = 0;
                vm.selectedSuppliers.forEach(
                    function(element){
                        var objectSelectedSuppliers ={};
                        objectSelectedSuppliers.Supplier_ID = element.Supplier_Code;
                        objectSelectedSuppliers.Supplier_Email = element.Supplier_Email;
                        objectSelectedSuppliers.Price_Status = Price_Status;
                        vm.selectedSuppliersrrequest.push(objectSelectedSuppliers);
                })

                vm.RequestPrice.RequestPrice_Product = ProductToSend;

                vm.RequestPrice.RequestPrice_Supplier = vm.selectedSuppliersrrequest;
                
                if (vm.selectSuplierType == 'supliers'){
                    vm.RequestPrice.Category_ID = undefined;
                }if (vm.selectSuplierType == 'Categories'){
                    vm.RequestPrice.RequestPrice_Supplier = [];
                };
                vm.RequestPrice.RequestPrice_Customer_ID = vm.selectedCustomer.Customer_Code
                $http({
                    method:"POST",
                    url:'http://35.246.143.96:3111/addRequestPrice',
                    data :vm.RequestPrice
                }).then(function(data){ 
                    vm.ProductRequests =[]
                    vm.ProductRequest =[];
                    vm.selectedCustomer = null;
                    vm.selectedSuppliers = {};
                    showAddToast('Request Added Successfully',$mdToast);
                    triLoaderService.setLoaderActive(false);
                });
                
            }
        }
    };
})();