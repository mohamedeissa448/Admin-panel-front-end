(function() {
    'use strict';

    angular
        .module('manageproduct')
        .controller('CopyProductController', CopyProductController);
        
    /* @ngInject */
    function CopyProductController($mdToast,$mdDialog, triLoaderService,$http, itemDataToCopy) {
        var vm = this;
        vm.ProductData = itemDataToCopy;
        
        vm.SubmitData=function(form){
            triLoaderService.setLoaderActive(true);
            
            $http({
                method:"POST",
                url:"http://35.246.143.96:3111/CopyProduct",
                data : vm.ProductData
            }).then(function(data){
                showAddToast('Product Copied successfully',$mdToast);
                $mdDialog.hide();
                triLoaderService.setLoaderActive(false);
            });
        }


//ddf
        // new test
        //hhh
    }
})();