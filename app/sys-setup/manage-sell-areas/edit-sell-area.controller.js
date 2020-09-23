(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('EditSellAreaController', EditSellAreaController);

    /* @ngInject */
    function EditSellAreaController($mdToast,$mdDialog, triLoaderService,$http,itemToEdit) {
        var vm = this;
        vm.SellArea = itemToEdit;
        if(vm.SellArea.SellingArea_IsActive == 1){
            vm.SellAreaStatus = true
        }
        else{
            vm.SellAreaStatus = false
        }
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            if( vm.SellAreaStatus == true){
                vm.SellArea.SellingArea_IsActive = 1;
            }
            else{
                vm.SellArea.SellingArea_IsActive = 0;
            }
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/EditSellingArea',
                data :JSON.stringify(vm.SellArea)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Selling Area edited successfully',$mdToast);
                    $mdDialog.hide();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };

    }
})();