(function() {
  "use strict";

  angular
    .module("manage-bills")
    .controller("viewSupplierReturnBillDetails", viewSupplierReturnBillDetails);

  /* @ngInject */
  function viewSupplierReturnBillDetails(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService,
    id
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http({
      method: "post",
      url: "http://localhost:4000/supplier-return-bill/getOneById",
      data: {_id : id }
    }).then(function(response) {
      vm.BillReturn_Code = response.data.BillReturn_Code ;
      vm.BillReturn_Date = response.data.BillReturn_Date ;
      vm.BillReturn_SysDate = response.data.BillReturn_SysDate ;
      vm.BillReturn_Note = response.data.BillReturn_Note ;
      vm.BillReturn_DoneBy_User = response.data.BillReturn_DoneBy_User ;
      vm.Bill_Supplier = response.data.Bill_Supplier ;
      vm.BillReturn_Products = response.data.BillReturn_Products ;
      vm.Bill_TotalAmount = 0 ;
      angular.forEach(vm.BillReturn_Products, function(element, key) {
        vm.Bill_TotalAmount += element.Quantity *  element.Cost;
      });
    });

      
    vm.CloseSupplierBill = function() {
      $mdDialog.hide();
    };
    
  }
})();
