(function() {
    'use strict';

    angular
        .module('pricerequest')
        .controller('GetSuppliersByProductController', GetSuppliersByProductController);

    /* @ngInject */
    function GetSuppliersByProductController($mdToast, $mdDialog, triLoaderService,$http,productlist) {
        var vmr = this;
        vmr.Productslist = productlist;
        vmr.searchForproduct = function(query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = vmr.Productslist.filter( function(product) {
                var lowercaseName = angular.lowercase(product.Product_Name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return product;
                }
            });
            return results;
        };
        vmr.Supplierslist = [];
        
        vmr.isChecked = function() {
            return vmr.selected.length === vmr.Supplierslist.length;
          };

        vmr.toggleAll = function() {
            if (vmr.selected.length === vmr.Supplierslist.length) {
              vmr.selected = [];
            } else if (vmr.selected.length === 0 || vmr.selected.length > 0) {
              vmr.selected = vmr.Supplierslist.slice(0);
            }
        };
        vmr.isIndeterminate = function() {
            return (vmr.selected.length !== 0 &&
                vmr.selected.length !== vmr.Supplierslist.length);
        };
        vmr.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
        vmr.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
              list.splice(idx, 1);
            }
            else {
              list.push(item);
            }
        };
        vmr.selected =[];
        vmr.SubmitSearch = function(){
            $http({
                method:"post",
                url:"http://35.246.143.96:3111/getSupplierByProductID",
                data :vmr.selectedProduct
            }).then(function(data){
                vmr.Supplierslist = data.data.Supplier;
            },function(error){
                console.log(error);
            });
        }
        vmr.submitSelectSupplier = function(){
            vmr.SelectedSupplierLest =[];
            var SelectedSupplier =[];
            angular.copy(vmr.selected, SelectedSupplier);
            SelectedSupplier.forEach(function(v){ 
                var supplier ={
                    Supplier_Code: v.Supplier_Code,
                    Supplier_Name: v.Supplier_Name,
                    Supplier_Email: v.Supplier_Email
                }
                vmr.SelectedSupplierLest.push(supplier)
             })
             $mdDialog.hide(vmr.SelectedSupplierLest );
            //console.log(vmr.SelectedSupplierLest )
            
        }
        
    };
})();