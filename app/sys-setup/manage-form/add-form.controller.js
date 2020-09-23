(function() {
    'use strict';

    angular
        .module('sys-setup')
        .controller('AddFormController', AddFormController);

    /* @ngInject */
    function AddFormController($mdToast, triLoaderService,$http) {
        var vm = this;
        vm.SubmitData = function(){
            triLoaderService.setLoaderActive(true);
            $http({
                method:'POST',
                url:'http://35.246.143.96:3111/AddForm',
                data :JSON.stringify(vm.Form)
            }).then(function(data){
                if (data.data.message==true) {
                    showAddToast('Category added successfully',$mdToast);
                    vm.Form= {};
                    vm.addFormForm.$setPristine();
                    vm.addFormForm.$setUntouched();
                    triLoaderService.setLoaderActive(false);
                }else{
                    showAddErrorToast(data.data.message,$mdToast);
                    triLoaderService.setLoaderActive(false);
                }
            });

        };
    }
})();