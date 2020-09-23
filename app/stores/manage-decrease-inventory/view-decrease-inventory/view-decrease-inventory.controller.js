(function() {
  "use strict";

  angular
    .module("stores")
    .controller("viewDecreaseInventoryDetails", viewDecreaseInventoryDetails);

  /* @ngInject */
  function viewDecreaseInventoryDetails(
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
      url: "http://localhost:4000/decreaseInventory/getOneById",
      data: {_id : id }
    }).then(function(response) {
      vm.DecreaseInventory_Date = response.data.DecreaseInventory_Date ;
      vm.DecreaseInventory_SysDate = response.data.DecreaseInventory_SysDate ;
      vm.DecreaseInventory_Note = response.data.DecreaseInventory_Note ;
      vm.DecreaseInventory_DoneBy_User = response.data.DecreaseInventory_DoneBy_User ;
      vm.DecreaseInventory_Products = response.data.DecreaseInventory_Products ;
    });

      
    vm.CloseDecreaseInventory = function() {
      $mdDialog.hide();
    };
    
  }
})();
