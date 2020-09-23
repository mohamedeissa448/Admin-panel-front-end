(function() {
  "use strict";

  angular
    .module("manage-bills")
    .controller("viewSupplierBillDetails", viewSupplierBillDetails);

  /* @ngInject */
  function viewSupplierBillDetails(
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
      url: "http://localhost:4000/supplier-bill/getOneById",
      data: {_id : id }
    }).then(function(response) {
      vm.Bill_Code = response.data.Bill_Code ;
      vm.Bill_Date = response.data.Bill_Date ;
      vm.Bill_SysDate = response.data.Bill_SysDate ;
      vm.Bill_Note = response.data.Bill_Note ;
      vm.Bill_DoneBy_User = response.data.Bill_DoneBy_User ;
      vm.Bill_Supplier = response.data.Bill_Supplier ;
      vm.Bill_TaxAmount = response.data.Bill_TaxAmount ;
      vm.Bill_TotalAmount = response.data.Bill_TotalAmount ;
      vm.Bill_FinalAmount = response.data.Bill_FinalAmount ;
      vm.Bill_PaymentMethod = response.data.Bill_PaymentMethod ;
      vm.Bill_Products = response.data.Bill_Products ;
    });

      
    vm.CloseSupplierBill = function() {
      $mdDialog.hide();
    };
    
  }
})();
