(function () {
    'use strict';

    angular
        .module('access-externally')
        .controller('ViewProductController', ViewProductController);

    /* @ngInject */
    function ViewProductController($window, $http, $mdToast, triLoaderService, triSettings, $stateParams) {
        var vm = this;
        vm.isLoding = true;
        vm.triSettings = triSettings;
        var data = {};
        data.row_id = $stateParams.pid;
        vm.data = data.data;
        console.log(data);
        $http({
            method: "post",
            url: "http://35.246.143.96:3111/getProductByID",
            data: data
        }).then(function (data) {
            console.log(data.data);
            vm.data = data.data;
            vm.isLoding = false;
        }, function (error) {
            console.log(error);
        });
        vm.printClick = printData;

        function printData() {
            // var divToPrint=document.getElementById("ProductDitailsTable");
            // newWin= window.open("");
            // newWin.document.write(divToPrint.outerHTML);
            // newWin.print();
            // newWin.close();
            $window.print();
        }

    };

})();