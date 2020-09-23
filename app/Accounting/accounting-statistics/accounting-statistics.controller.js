(function() {
  "use strict";

  angular
    .module("accounting")
    .controller("ManageAccountingStatisticsController", ManageAccountingStatisticsController);

  /* @ngInject */
  function ManageAccountingStatisticsController(UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
    vm.retriveSales=function () {
      $http({
        method: "get",
        url: "http://35.246.143.96:3111/getAllSalesForStatistics",//we just need to get only Total_Receivable_Price and Total_Price_After_Taxes for all sales
      }).then(function(data) {
        vm.saleslist = data.data
        console.log(data.data);
        vm.Total_All_Sales_Prices_After_Taxes = 0 ;
        vm.Total_All_Sales_Receivables_Prices = 0 ;
        angular.forEach(vm.saleslist, function(element, key) {
          vm.Total_All_Sales_Prices_After_Taxes += element.Total_Price_After_Taxes ;
          vm.Total_All_Sales_Receivables_Prices += element.Total_Receivable_Price ;
        });
      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retriveSales();
    /////////////////////////////////////////
    vm.retrivePurchasings=function () {
      $http({
        method: "get",
        url: "http://35.246.143.96:3111/getAllPurchasingsForStatistics",//we just need to get only Total_Paid_Price and Total_Price_After_Taxes for all purchasings
      }).then(function(data) {
        vm.purchasingslist = data.data
        console.log(data.data);
        vm.Total_All_Purchasings_Prices_After_Taxes = 0 ;
        vm.Total_All_Purchasings_Payments_Prices = 0 ;
        console.log("vm.purchasingslist",vm.purchasingslist)

        angular.forEach(vm.purchasingslist, function(element, key) {
          console.log("element",element)
          vm.Total_All_Purchasings_Prices_After_Taxes += element.Total_Price_After_Taxes ;
          vm.Total_All_Purchasings_Payments_Prices += element.Total_Paid_Price ;
        });
        console.log("vm.Total_All_Purchasings_Prices_After_Taxes",vm.Total_All_Purchasings_Prices_After_Taxes)
        console.log("vm.Total_All_Purchasings_Payments_Prices",vm.Total_All_Purchasings_Payments_Prices)

      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retrivePurchasings();

  }
})();
