(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddSellAreaController', AddSellAreaController);

    /* @ngInject */
    function AddSellAreaController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddSellingArea',
                data :JSON.stringify(vm.SellArea)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Selling Area added successfully',$mdToast);
                    vm.SellArea= {};
                    vm.addSellAreaForm.$setPristine();
                    vm.addSellAreaForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();